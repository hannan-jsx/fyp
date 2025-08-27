import HeroSection from "@/components/HeroSection";
import StarParticlesComponent from "@/components/StarParticlesComponent";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const Home = () => {
  return (
    <LazyLoadComponent threshold={100}>
      <StarParticlesComponent />
      <HeroSection />
    </LazyLoadComponent>
  );
};

export default Home;
