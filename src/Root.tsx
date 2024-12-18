import {Composition} from 'remotion';
import {NachosStory} from './NachosStory';
import {nachosStoryData} from './data/nachosStory';

const nachosData = {
  id: "nachos-creation",
  title: "How Nachos Were Invented",
  text1: "Nachos were created by a quick-thinking maitre d' trying to feed hungry customers after hours!",
  image1: "/image1.png",
  text2: "In 1943, wives of U.S. soldiers shopping in Mexico came to Ignacio Anaya's restaurant after it closed.",
  image2: "/image2.png",
  text3: "With no chef around, Ignacio (nicknamed 'Nacho') decided to experiment with what he had.",
  image3: "/image3.png",
  text4: "He topped tortilla chips with cheese and jalapeños, then heated them - creating 'Nacho's special'.",
  image4: "/image4.png",
  text5: "The women loved it so much, they spread the word about this new dish.",
  image5: "/image5.png",
  text6: "Today, nachos are stadium favorites worldwide - thanks to one resourceful restaurant worker!",
  image6: "/image6.png",
  // Add your Azure credentials here
  azureKey: 'CUSyqo5PEi3f7lSU50FwB0crRAFmAlJrLzKnOAAQ9XuDZCkTlhbRJQQJ99ALACYeBjFXJ3w3AAAYACOGw56F',
  azureRegion: 'eastus'
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NachosStory"
        component={NachosStory}
        durationInFrames={6000} // This is just a maximum duration, actual duration will be based on audio lengths
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
