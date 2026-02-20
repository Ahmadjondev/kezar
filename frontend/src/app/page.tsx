import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroVideo from "@/components/ui/HeroVideo";
import Statistics from "@/components/ui/Statistics";
import KezarIntro from "@/components/ui/KezarIntro";
import VideoShowcase from "@/components/ui/VideoShowcase";
import Clients from "@/components/ui/Clients";
import { fetchLandingPage } from "@/lib/api";

export default async function Home() {
  const data = await fetchLandingPage();
  const { settings, statistics, clients } = data;

  return (
    <>
      <Navbar />
      <main>
        <HeroVideo videoId={settings.hero_video_id} />
        <Statistics statistics={statistics} />
        <KezarIntro settings={settings} />
        <VideoShowcase settings={settings} />
        <Clients clients={clients} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
