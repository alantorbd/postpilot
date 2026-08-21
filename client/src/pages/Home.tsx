import Hero from "../components/Home/Hero";
import Navbar from "../components/Home/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif">
      <Navbar />
      <Hero />
    </div>
  );
}
