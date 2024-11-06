"use client";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useScroll, useTransform } from "framer-motion";
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation'

 
export default function Home() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
 
  const router = useRouter();

  // Function to handle navigation
  const handleNavigation = () => {
    router.push("/repository"); // Navigates to the home page
  };

  useEffect(() => {
    // Debug log for `scrollYProgress` updates
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest > 0.62) {
        handleNavigation();
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, [scrollYProgress, router]);


  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
 
  return (
    <div
    className="h-[400vh] py-10 bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
    ref={ref}
  >
    <div className="absolute left-12 top-12"> <p className="white">{}</p></div>
    <GoogleGeminiEffect
      handleNavigation={handleNavigation}
      pathLengths={[
        pathLengthFirst,
        pathLengthSecond,
        pathLengthThird,
        pathLengthFourth,
        pathLengthFifth,
      ]}
    />
    
  </div>
);
}
