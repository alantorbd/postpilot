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
    console.log({ prompt, tone, generateImage });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(400).json({
        message:
          "Gemini API key is missing. Please add it to your server/.env file.",
      });
      return;
    }
    const ai = new GoogleGenAI({ apiKey: apiKey });
    // Generating Text
    // const textResponse = await ai.models.generateContent({
    //   model: "gemini-3.7-flash",
    //   contents: `Generate a social media post based on this prompt: "${prompt}".
    //   Tone: ${tone}.
    //   Include relate hashtags.
    //   Format the response as JSON with "content" and "imagePrompt" fields.
    //   The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.`,
    // });

    const textResponse = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",

      input: `Generate a social media post based on this prompt: "${prompt}".
      Tone: ${tone}.
      Include relate hashtags.
      Format the response as JSON with "content" and "imagePrompt" fields.
      The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.`,
    });
    console.log(textResponse.output_text);
    let content = "";
    let imagePrompt = prompt;
    try {
      // const rawText = textResponse.text || "";
      const rawText = textResponse.output_text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const data = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { content: rawText, imagePrompt: prompt };
      content = data.content;
      imagePrompt = data.imagePrompt;
    } catch {
      content = textResponse.output_text || "";
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

// export const generatePost = async (
//   req: AuthRequest,
//   res: Response,
// ): Promise<void> => {
//   try {
//     // 1. Get data from request
//     const { prompt, tone, generateImage } = req.body;

//     console.log("Generate Post Request:", {
//       prompt,
//       tone,
//       generateImage,
//     });

//     // 2. Validate required fields
//     if (!prompt) {
//       res.status(400).json({
//         message: "Prompt is required.",
//       });
//       return;
//     }

//     if (!tone) {
//       res.status(400).json({
//         message: "Tone is required.",
//       });
//       return;
//     }

//     // 3. Check Gemini API key
//     const apiKey = process.env.GEMINI_API_KEY;

//     if (!apiKey) {
//       res.status(500).json({
//         message:
//           "Gemini API key is missing. Please add it to your server/.env file.",
//       });
//       return;
//     }

//     // 4. Initialize Gemini
//     const ai = new GoogleGenAI({
//       apiKey,
//     });

//     // 5. Generate social media post
//     const textResponse = await ai.interactions.create({
//       model: "gemini-3.1-flash-lite",

//       input: `
// Generate a social media post based on the following information.

// Topic:
// "${prompt}"

// Tone:
// ${tone}

// Requirements:
// - Write an engaging social media post.
// - Include relevant hashtags.
// - Generate a detailed image prompt that visually matches the post.
// - Return ONLY valid JSON.
// - Do not use markdown code blocks.

// JSON format:
// {
//   "content": "The complete social media post",
//   "imagePrompt": "A detailed prompt for an AI image generator"
// }
//       `,
//     });

//     console.log("Gemini Response:", textResponse.output_text);

//     // 6. Parse Gemini response
//     let content = "";
//     let imagePrompt = prompt;

//     try {
//       const rawText = textResponse.output_text?.trim() || "";

//       // Try to find JSON object from response
//       const jsonMatch = rawText.match(/\{[\s\S]*\}/);

//       if (jsonMatch) {
//         const parsedData = JSON.parse(jsonMatch[0]);

//         content = parsedData.content || rawText;
//         imagePrompt = parsedData.imagePrompt || prompt;
//       } else {
//         // If Gemini doesn't return valid JSON
//         content = rawText;
//       }
//     } catch (parseError) {
//       console.error("JSON Parse Error:", parseError);

//       // Fallback
//       content = textResponse.output_text || "";
//       imagePrompt = prompt;
//     }

//     // 7. Generate image
//     let mediaUrl = "";
//     let mediaType: "image" | undefined;

//     if (generateImage === true || generateImage === "true") {
//       /*
//        * TODO:
//        * Call your image generation API here using imagePrompt.
//        *
//        * Example:
//        * const generatedImage = await generateImageFromPrompt(imagePrompt);
//        * mediaUrl = generatedImage.url;
//        */

//       // Temporary image URL for testing
//       mediaUrl =
//         "https://static.vecteezy.com/system/resources/thumbnails/070/634/522/small/overhead-shot-of-social-media-strategy-meeting-with-graphics-and-team-collaboration-for-marketing-photo.jpeg";

//       mediaType = "image";
//     }

//     // 8. Save generation to database
//     const generation = await Generation.create({
//       user: req.user._id,
//       prompt,
//       content,
//       tone,
//       mediaUrl: mediaUrl || undefined,
//       mediaType,
//     });

//     // 9. Send response
//     res.status(201).json({
//       success: true,
//       message: "Post generated successfully.",
//       data: generation,
//     });
//   } catch (error: any) {
//     // 10. Handle unexpected errors
//     console.error("🔥 GENERATE POST ERROR");
//     console.error("Message:", error?.message);
//     console.error("Status:", error?.status);
//     console.error("Stack:", error?.stack);

//     res.status(500).json({
//       success: false,
//       message: error?.message || "Failed to generate post.",
//     });
//   }
// };

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
