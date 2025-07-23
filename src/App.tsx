import { LazyLoadComponent } from 'react-lazy-load-image-component';
import HeroSection from './components/HeroSection';
import InfoSection from './components/InfoSection';
import ScrollToTopButton from './components/ScrollToTopButton';
import StarParticlesComponent from './components/StarParticlesComponent';

function App() {
  return (
    <>
      <LazyLoadComponent threshold={100}>
        <StarParticlesComponent />
        <HeroSection />
        <InfoSection />
      </LazyLoadComponent>

      {/* <ScrollToTopButton /> */}
    </>
  );
}

export default App;
