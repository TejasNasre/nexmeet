import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

interface CardProps {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  isFullGif?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  bgColor,
  isFullGif,
}) => {
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      controls.start({
        x: (x - rect.width / 2) / 20,
        y: (y - rect.height / 2) / 20,
        transition: { duration: 0.2 },
      });
    }
  };

  const handleHoverEnd = () => {
    controls.start({ x: 0, y: 0, transition: { duration: 0.2 } });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center lg:p-4 sm:p-2">
      <motion.div
        ref={cardRef}
        className={`w-full max-w-sm mx-auto h-[400px] rounded-3xl overflow-hidden ${
          isFullGif ? "" : "p-8 flex flex-col justify-between"
        } ${bgColor}`}
        animate={controls}
        whileHover={{ scale: 1.05 }}
        onMouseMove={handleHover}
        onMouseLeave={handleHoverEnd}
      >
        {isFullGif ? (
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={title}
              width={500}
              height={500}
              className="w-full h-full object-cover"
              unoptimized
            />
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="p-4">
                <h3 className="text-2xl font-bold text-white mb-2 text-shadow">
                  {title}
                </h3>
                <p className="text-white text-shadow">{description}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
              <p className="text-white mb-6">{description}</p>
            </div>
            <Image
              src={image}
              alt={title}
              className="w-full rounded-lg shadow-lg"
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const highlightVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="relative inline-block"
      initial="hidden"
      animate={controls}
    >
      <span className="relative z-10">{text}</span>
      <svg
        className="absolute -bottom-2 left-0 w-full h-8 z-0"
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M5 15 Q50 5 100 15 T200 15 T300 15"
          fill="none"
          stroke="#FFEB3B"
          strokeWidth="6"
          variants={highlightVariants}
        />
      </svg>
    </motion.div>
  );
};

const FeatureCards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const cards: CardProps[] = [
    {
      title: "Need space to host your event? We got you 😉",
      description:
        "Explore event spaces in your area and book them for your next event",
      image:
        "https://media.giphy.com/media/bNqswZuM0Zf0yLHp5b/giphy.gif?cid=790b7611wfz0vclzoce7q2x93roruh4xsa4fqpabvzkp0io6&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      bgColor: "bg-gradient-to-b from-purple-400 to-indigo-600",
      isFullGif: true,
    },
    {
      title: "Doesn't matter what category your event is, we have you covered",
      description:
        "We respect everybody's choices and try to make it as per your needs",
      image:
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXQ1bDA5ZXhuczBhdmM0YWJjcDF3aDZqcHQ3M2lib2tyMDh0bWt3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/REPL2BIiGhyFO/giphy.gif",
      bgColor: "bg-gradient-to-b from-purple-400 to-pink-600",
      isFullGif: true,
    },
    {
      title: "Network to get work",
      description:
        "Connect with like-minded people out there and grab those opportunities.",
      image:
        "https://media.giphy.com/media/dDCy1VKsop5N22Nulf/giphy.gif?cid=790b7611qjer241ezpur4d0ysg715osh9gny8pb3xllhzewf&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      bgColor: "bg-gradient-to-b from-green-400 to-teal-600",
      isFullGif: true,
    },
    {
      title: "Keep an eye on your personal growth!!",
      description: "Track no. of events you organised and participated in",
      image:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHQ1b3k4YTVlY2Y2YWFpYXp2NDlncHd4dW02Y3BhbXd2Z3N3aHk3MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Emb1u5OKSGqtQixcEV/giphy.gif",
      bgColor: "bg-gradient-to-b from-yellow-400 to-orange-600",
      isFullGif: true,
    },
    {
      title: "Gotta sell those tix",
      description:
        "Manage registrations and ticket sales effortlessly for your events.",
      image:
        "https://media.giphy.com/media/9r73dCeJarx5kdXmu2/giphy.gif?cid=790b7611j7r0cesyfrasvkpfcmd6robhgy1exzpqtu0y80e3&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      bgColor: "bg-gradient-to-b from-red-400 to-pink-600",
      isFullGif: true,
    },
    {
      title: "You chose who you invite",
      description:
        "Organiser can invite anyone and have that ability to reject or approve",
      image:
        "https://media.giphy.com/media/3oFyD2RpK1Qs4Cl9rq/giphy.gif?cid=790b7611zh5es36523gupnek7rrxx0dlq0qyfyana2hiuoc0&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      bgColor: "bg-gradient-to-b from-indigo-400 to-purple-600",
      isFullGif: true,
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(window.innerWidth >= 1024 ? 3 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextCard = () =>
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, cards.length - visibleCards)
    );
  const prevCard = () =>
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      prevCard();
    } else if (info.offset.x < -100) {
      nextCard();
    }
  };
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === cards.length - visibleCards;
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            What do we have in store for you?
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevCard}
              className={`rounded-full p-2 transition-colors duration-300 ${
                isFirstCard
                  ? "bg-gray-600 text-gray-400"
                  : "bg-indigo-600 text-white"
              }`}
              aria-label="Previous card"
              disabled={isFirstCard}
            >
              ←
            </button>
            <button
              onClick={nextCard}
              className={`rounded-full p-2 transition-colors duration-300 ${
                isLastCard
                  ? "bg-gray-600 text-gray-400"
                  : "bg-indigo-600 text-white"
              }`}
              aria-label="Next card"
              disabled={isLastCard}
            >
              →
            </button>
          </div>
        </div>
        <div ref={constraintsRef} className="overflow-hidden">
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={constraintsRef}
            onDragEnd={handleDragEnd}
            animate={{ x: `${-currentIndex * (100 / visibleCards)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className={`flex-shrink-0 px-2 ${
                  visibleCards === 1 ? "w-full" : "w-1/3"
                }`}
              >
                <Card {...card} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
