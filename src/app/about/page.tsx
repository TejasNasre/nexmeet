'use client'

import { Space_Grotesk } from 'next/font/google'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lightbulb, Rocket, Users, Code, Calendar, Zap } from 'lucide-react'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

interface ProfileCardProps {
  name: string;
  role: string;
  imageSrc: string;
  description: string;
}

interface MemeCardProps {
  imageSrc: string;
  caption: string;
}

export default function AboutUs() {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <section className={`${spaceGrotesk.className} bg-black text-white min-h-screen relative overflow-hidden`}>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-12 text-center tracking-tight font-spaceGrotesk"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h1>
        
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.p 
            className="text-xl mb-8 leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Born from a vision in our second year of B.Tech, our event management platform aims to revolutionize how college communities organize and experience events. Now in our third year, we're turning that vision into reality.
          </motion.p>
          <motion.p 
            className="text-xl leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Our goal is to create a seamless, intuitive platform that brings people together, fostering vibrant college communities. We're starting local, but our ambitions are set on broader horizons.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center relative mb-20">
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.div variants={iconVariants}><Lightbulb size={40} className="text-gray-400" /></motion.div>
            <motion.div variants={iconVariants}><Rocket size={40} className="text-gray-400" /></motion.div>
            <motion.div variants={iconVariants}><Users size={40} className="text-gray-400" /></motion.div>
          </motion.div>
          <motion.div 
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2, delay: 0.6 }}
          >
            <motion.div variants={iconVariants}><Code size={40} className="text-gray-400" /></motion.div>
            <motion.div variants={iconVariants}><Calendar size={40} className="text-gray-400" /></motion.div>
            <motion.div variants={iconVariants}><Zap size={40} className="text-gray-400" /></motion.div>
          </motion.div>
          <ProfileCard
            name="Tejas Nasre"
            role="Founder & Full Stack Developer"
            imageSrc="https://imgs.search.brave.com/gpyA6z0GSbz__p922if_Pk9XuUQDayLz1fuRzy9NlrM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90ZWph/c25hc3JlLnRlY2gv/YXNzZXRzL2ltYWdl/cy9teS1hdmF0YXIu/anBn
"
            description="The visionary behind our platform. Tejas conceived this idea in his second year of B.Tech and has been the driving force in bringing it to life. With a year of full-stack development experience, he's turning his dream into our shared reality."
          />
          <ProfileCard
            name="Soham Khedkar"
            role="Co-founder & Full Stack Developer"
            imageSrc="https://lh3.googleusercontent.com/a/ACg8ocJNDuM0Mr8tqxtwBdcorKQ5ILMK2odH1w506qqq6KYGg0wolE6LQ96hzEaiOTA1zwZs-baynQgWrXJLREXzKa4b6IyECunM=s360-c-no"
            description="Best friend and crucial contributor to the project. Soham joined forces with Tejas to elevate this vision. With his year of full-stack expertise, he's been instrumental in shaping our platform's robust architecture."
          />
        </div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center tracking-tight">Meme Corner</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <MemeCard
              imageSrc="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExampnZXpxd2JxZTVka3gxOHQ4aW1zZ3dkcnNsMGp0bW0zZ2k5eGlzZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/i2TRK98cLrKfKvHI9t/giphy.gif"
              caption="When you realize your event planning skills are just 'winging it' with extra steps"
            />
            <MemeCard
              imageSrc="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMndrZnA2aGNvNmhsNTc1OTd5emZ1ZHNrZnh1MDRja3Q0dXJ0NTRubiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/B3RnX6anFsKFa/giphy.gif"
              caption="College events be like: 20% planning, 80% last-minute panic"
            />
            <MemeCard
              imageSrc="https://media.giphy.com/media/3o7520Dw4MJSxrrnVu/giphy.gif?cid=790b7611uf72ji4po4394pfguxd0x93bnvl1zl96keonqqs3&ep=v1_gifs_search&rid=giphy.gif&ct=g"
              caption="That moment when your event budget is more optimistic than your GPA"
            />
            <MemeCard
              imageSrc="https://media.giphy.com/media/l2JhDpSMnXPYsvK36/giphy.gif?cid=790b7611yeekw92jardn4mktw1ivx8586w6y1ydw268oucns&ep=v1_gifs_search&rid=giphy.gif&ct=g"
              caption="Event management: Where 'Plan B' is just the beginning of the alphabet"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProfileCard({ name, role, imageSrc, description }: ProfileCardProps) {
  return (
    <motion.div 
      className="bg-white bg-opacity-5 p-8 rounded-2xl shadow-2xl relative overflow-hidden group backdrop-blur-sm text-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-grid-white/[0.025] bg-[length:20px_20px]" />
      <div className="relative z-10">
        <motion.div 
          className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white ring-opacity-20"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={imageSrc}
            alt={name}
            width={192}
            height={192}
            className="w-full"
          />
        </motion.div>
        <h3 className="text-3xl font-semibold mb-2 tracking-tight">{name}</h3>
        <p className="text-gray-400 mb-6 text-lg font-light highlight-text">{role}</p>
        <p className="text-gray-300 leading-relaxed font-light">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
    </motion.div>
  )
}

function MemeCard({ imageSrc, caption }: MemeCardProps) {
  return (
    <motion.div 
      className="bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg relative"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 bg-grid-white/[0.025] bg-[length:20px_20px]" />
      <div className="relative z-10">
        <Image
          src={imageSrc}
          alt="Meme"
          width={400}
          height={300}
          className="w-full h-auto object-cover"
        />
        <div className="p-4">
          <p className="text-xl font- text-gray-300">{caption}</p>
        </div>
      </div>
    </motion.div>
  )
}