import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";
import Hero from "../components/Home/Hero";
import HowItWorks from "../components/Home/HowItWorks";
import Navbar from "../components/Home/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />

      <Footer />
    </div>
  );
}
