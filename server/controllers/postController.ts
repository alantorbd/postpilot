import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { GoogleGenAI } from "@google/genai";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";
import { cloudinary } from "../config/cloudinary.js";

//Post /api/posts/generate
export const generatePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { prompt, tone, generateImage } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(400).json({
        message:
          "Gemini API key is missing. Please add it to your server/.env file.",
      });
      return;
    }
    const ai = new GoogleGenAI({ apiKey });
    //Generating Text
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a social media post based on this prompt: "${prompt}".
      Tone: ${tone}. 
      Include relavet hashtages.
      Format the response as JSON with "content" and "imagePrompt" fields.
      The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.`,
    });
    let content = "";
    let imagePrompt = prompt;
    try {
      const rawText = textResponse.text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const data = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { content: rawText, imagePrompt: prompt };
      content = data.content;
      imagePrompt = data.imagePrompt;
    } catch {
      content = textResponse.text || "";
    }
    let mediaUrl: string = "";

    if (generateImage) {
      mediaUrl =
        "https://static.vecteezy.com/system/resources/thumbnails/070/634/522/small/overhead-shot-of-social-media-strategy-meeting-with-graphics-and-team-collaboration-for-marketing-photo.jpeg";
    }

    //save to db
    const generation = await Generation.create({
      user: req.user._id,
      prompt,
      content,
      tone,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
    });

    res.json(generation);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

//GET /api/posts/generations
export const getGenerations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const generations = await Generation.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(generations);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

//GET /api/posts
export const getPosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

//Post /api/posts
export const schedulePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { content, platforms, scheduledFor, status } = req.body;
    //Parse platforms
    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (error: any) {
        parsedPlatforms = platforms.split(",");
      }
    }
    let mediaUrl: string | undefined = req.body.mediaUrl;
    let mediaType: "image" | "video" | undefined = req.body.mediaType;
    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "postpilot" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        stream.end(req.file!.buffer);
      });
      mediaUrl = result.secure_url;
      mediaType = result.resource_type == "video" ? "video" : "image";
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      platforms: parsedPlatforms,
      mediaType,
      mediaUrl,
      scheduledFor,
      status,
    });
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};
