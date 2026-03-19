'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
    Award,
    CheckCircle2,
    Clock,
    Copy,
    Facebook,
    Gift,
    Heart,
    IndianRupee,
    Mail,
    MessageCircle,
    Send,
    Share2,
    Shield,
    Sparkles,
    TrendingUp,
    Trophy,
    Twitter,
    Users,
    Wallet,
    Zap
} from 'lucide-react'
import { useState } from 'react'

// ==================== HERO SECTION ====================
function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-12 pb-20">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Traditional Corner Decorations */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full text-amber-700">
          <path d="M0,0 Q50,50 0,100 L0,0 Z M0,0 Q50,50 100,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-10 rotate-180">
        <svg viewBox="0 0 200 200" className="w-full h-full text-amber-700">
          <path d="M0,0 Q50,50 0,100 L0,0 Z M0,0 Q50,50 100,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Traditional Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-amber-200 shadow-md mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">प्रतिष्ठित संदर्भ कार्यक्रम</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              धार्मिक ज्ञान साझा करें,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mt-2">
                दिव्य पुरस्कार पाएं
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              जैन धर्म की शिक्षाओं को फैलाएं और प्रत्येक आत्मा के लिए पुरस्कार अर्जित करें। आपका रेफरल केवल कमाई नहीं है — यह समुदाय के लिए <span className="font-semibold text-amber-700">पुण्य</span> का निर्माण है।
            </p>

            {/* Sanskrit Shloka */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative p-6 bg-gradient-to-r from-amber-100/60 to-orange-100/60 rounded-2xl border-l-4 border-amber-600 mb-8 backdrop-blur-sm"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-amber-600 text-xl">🪷</span>
              </div>
              <p className="text-base md:text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
                "परस्परोपग्रहो जीवानाम्"
              </p>
              <p className="text-sm text-gray-600 italic">
                Souls render service to one another
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#refer"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(217, 119, 6, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Gift className="w-5 h-5" />
                अभी रेफर करें
              </motion.a>
              <motion.a
                href="#benefits"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-700 rounded-full font-semibold shadow-md hover:shadow-lg border-2 border-amber-200 transition-all"
              >
                लाभ जानें
                <TrendingUp className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Illustration/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-amber-100 shadow-2xl">
              {/* Decorative Element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 blur-2xl" />
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">5,000+</div>
                  <div className="text-sm text-gray-600">सक्रिय सदस्य</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <IndianRupee className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₹50L+</div>
                  <div className="text-sm text-gray-600">वितरित पुरस्कार</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">15K+</div>
                  <div className="text-sm text-gray-600">सफल रेफरल</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">24 घंटे</div>
                  <div className="text-sm text-gray-600">भुगतान समय</div>
                </motion.div>
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-semibold">100% सुरक्षित और विश्वसनीय</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== BENEFITS SECTION ====================
function BenefitsSection() {
  const benefits = [
    {
      icon: Wallet,
      title: 'तत्काल पुरस्कार',
      amount: '₹500',
      description: 'प्रत्येक मित्र के लिए ₹500 कमाएं जो आपके रेफरल लिंक के माध्यम से अपनी पहली विधि बुक करता है',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: Gift,
      title: 'मित्र को बोनस',
      amount: '₹300',
      description: 'आपके मित्र को उनकी पहली बुकिंग पर ₹300 की छूट मिलती है—एक उपहार जो दोनों आत्माओं को लाभान्वित करता है',
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: Trophy,
      title: 'असीमित कमाई',
      amount: '∞',
      description: 'कोई सीमा नहीं! असीमित परिवारों को रेफर करें और धार्मिक ज्ञान फैलाने के लिए पुरस्कार अर्जित करते रहें',
      gradient: 'from-amber-600 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
    },
    {
      icon: Zap,
      title: 'त्वरित भुगतान',
      amount: '24 घंटे',
      description: '24 घंटों के भीतर सीधे अपने बैंक खाते या वॉलेट में अपने पुरस्कार प्राप्त करें',
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Award,
      title: 'विशेष मील के पत्थर',
      amount: 'बोनस',
      description: '5, 10 और 25 रेफरल पर अतिरिक्त बोनस अनलॉक करें—आपका समर्पण मान्यता का हकदार है',
      gradient: 'from-yellow-600 to-amber-600',
      bgGradient: 'from-yellow-50 to-amber-50',
    },
    {
      icon: Heart,
      title: 'आध्यात्मिक पुण्य',
      amount: 'पुण्य',
      description: 'पुरस्कारों से परे, परिवारों को प्रामाणिक जैन अनुष्ठानों और परंपराओं से जोड़कर आध्यात्मिक पुण्य अर्जित करें',
      gradient: 'from-red-600 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
    },
  ]

  return (
    <section id="benefits" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #d97706 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-semibold text-amber-900">कार्यक्रम के लाभ</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            हमारे पवित्र रेफरल कार्यक्रम में
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              क्यों शामिल हों?
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            प्रत्येक रेफरल हमारे समुदाय को मजबूत करता है और किसी को धार्मिक ज्ञान के करीब लाता है
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
                className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-amber-200 transition-all duration-300"
              >
                {/* Gradient Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${benefit.gradient} rounded-t-2xl`} />

                {/* Icon */}
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${benefit.bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {benefit.title}
                </h3>

                <div className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  {benefit.amount}
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 border-2 border-amber-300 rounded-br-2xl" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ==================== HOW IT WORKS SECTION ====================
function HowItWorks() {
  const steps = [
    {
      number: '१',
      title: 'अपना लिंक साझा करें',
      description: 'अपना अनूठा रेफरल लिंक या कोड कॉपी करें और WhatsApp, सोशल मीडिया या ईमेल के माध्यम से मित्रों, परिवार और समुदाय के सदस्यों के साथ साझा करें',
      icon: Share2,
    },
    {
      number: '२',
      title: 'वे विधि बुक करें',
      description: 'जब कोई आपके रेफरल लिंक का उपयोग करके अपनी पहली जैन विधि विधान सेवा बुक करता है, तो उन्हें तुरंत ₹300 की छूट मिलती है',
      icon: Award,
    },
    {
      number: '३',
      title: 'आपको पुरस्कार मिले',
      description: 'एक बार उनकी बुकिंग की पुष्टि हो जाने पर, 24 घंटों के भीतर ₹500 आपके खाते में जमा कर दिया जाता है—स्वचालित रूप से और परेशानी मुक्त',
      icon: Wallet,
    },
    {
      number: '४',
      title: 'दोहराएं और अधिक कमाएं',
      description: 'साझा करते रहें, कमाते रहें! आप कितने लोगों को रेफर कर सकते हैं और कितना कमा सकते हैं, इसकी कोई सीमा नहीं है',
      icon: TrendingUp,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-semibold text-amber-900">सरल प्रक्रिया</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            यह कैसे काम करता है
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            धार्मिक ज्ञान फैलाते हुए कमाई शुरू करने के लिए सरल चरण
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connecting Line - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[60%] w-[80%] h-0.5">
                    <div className="w-full h-full bg-gradient-to-r from-amber-300 via-orange-300 to-transparent" />
                  </div>
                )}

                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 left-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white transform rotate-12">
                      <span className="text-2xl font-bold text-white transform -rotate-12" style={{ fontFamily: 'serif' }}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-amber-700" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative Dot */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-amber-400 rounded-full" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="#refer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
          >
            अभी शुरू करें
            <TrendingUp className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// ==================== CTA SECTION ====================
function CTASection() {
  const [referralCode, setReferralCode] = useState('JAIN2024XXXXX')
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const generateLink = () => {
    const userId = 'JAIN' + Math.random().toString(36).substr(2, 8).toUpperCase()
    const link = `https://jainvidhividhan.com/ref/${userId}`
    setReferralCode(link)
    setGenerated(true)
    setTimeout(() => setGenerated(false), 3000)
    copyCode()
  }

  const shareWhatsApp = () => {
    const message = `🪷 *जैन विधि विधान* 🪷%0A%0Aअपनी पहली पूजा बुकिंग पर ₹300 की छूट पाएं!%0A%0Aमेरा कोड उपयोग करें: ${referralCode}%0A%0Aअनुभवी पंडितों के साथ प्रामाणिक जैन अनुष्ठान बुक करें।%0A%0A🙏 अभी जुड़ें!`
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralCode)}`, '_blank')
  }

  const shareTwitter = () => {
    const message = `जैन विधि विधान में शामिल हों और ₹300 की छूट पाएं! कोड: ${referralCode}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank')
  }

  const shareTelegram = () => {
    const message = `🪷 जैन विधि विधान - पहली बुकिंग पर ₹300 की छूट! कोड: ${referralCode}`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralCode)}&text=${encodeURIComponent(message)}`, '_blank')
  }

  const shareEmail = () => {
    const subject = 'जैन विधि विधान में शामिल हों - ₹300 की छूट पाएं'
    const body = `नमस्ते,%0A%0Aमैं आपको जैन विधि विधान में शामिल होने के लिए आमंत्रित कर रहा हूं।%0A%0Aमेरा रेफरल कोड: ${referralCode}%0A%0Aआपको पहली बुकिंग पर ₹300 की छूट मिलेगी!%0A%0A🙏`
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <section id="refer" className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-amber-200 shadow-2xl"
        >
          {/* Decorative Corner Accent */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl opacity-30 blur-2xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-tl from-amber-400 to-orange-500 rounded-3xl opacity-30 blur-2xl" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <Gift className="w-4 h-4 text-amber-700" />
              <span className="text-sm font-semibold text-amber-900">रेफरल कार्यक्रम</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              आज ही कमाई शुरू करें!
            </h2>
            <p className="text-gray-600 text-lg">
              अपना अनूठा रेफरल कोड प्राप्त करें और जैन ज्ञान की रोशनी फैलाते हुए पुरस्कार अर्जित करना शुरू करें
            </p>
          </div>

          {/* Referral Code Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl text-center font-mono text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyCode}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    कॉपी हो गया!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    कॉपी करें
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="max-w-2xl mx-auto space-y-4 mb-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateLink}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              मेरा रेफरल लिंक जनरेट करें
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'जैन विधि विधान रेफरल',
                    text: `🪷 जैन विधि विधान में शामिल हों! कोड ${referralCode} उपयोग करें और ₹300 की छूट पाएं`
                  })
                }
              }}
              className="w-full py-4 bg-white border-2 border-amber-300 text-amber-900 rounded-2xl font-semibold hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              अभी शेयर करें
            </motion.button>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {(copied || generated) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto mb-8 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl"
              >
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold text-sm md:text-base">
                    {copied && !generated && 'क्लिपबोर्ड पर कॉपी हो गया! पुरस्कार अर्जित करने के लिए साझा करना शुरू करें'}
                    {generated && 'आपका अनूठा रेफरल लिंक तैयार है!'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Share */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">इसके माध्यम से साझा करें:</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { icon: MessageCircle, onClick: shareWhatsApp, bg: 'bg-green-600 hover:bg-green-700', label: 'WhatsApp' },
                { icon: Facebook, onClick: shareFacebook, bg: 'bg-blue-600 hover:bg-blue-700', label: 'Facebook' },
                { icon: Twitter, onClick: shareTwitter, bg: 'bg-sky-500 hover:bg-sky-600', label: 'Twitter' },
                { icon: Send, onClick: shareTelegram, bg: 'bg-blue-500 hover:bg-blue-600', label: 'Telegram' },
                { icon: Mail, onClick: shareEmail, bg: 'bg-gray-600 hover:bg-gray-700', label: 'Email' },
              ].map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={social.onClick}
                    className={`w-14 h-14 ${social.bg} rounded-2xl flex items-center justify-center text-white shadow-lg transition-all`}
                    title={social.label}
                  >
                    <IconComponent className="w-6 h-6" />
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 pt-8 border-t-2 border-amber-100">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium">सुरक्षित और विश्वसनीय • 50,000+ संतुष्ट ग्राहक</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ==================== TERMS SECTION ====================
function TermsSection() {
  const terms = [
    'रेफरर ₹500 कमाता है जब रेफर किया गया मित्र अपनी पहली भुगतान बुकिंग पूरी करता है',
    'रेफर किया गया मित्र एक नया उपयोगकर्ता होना चाहिए जिसने पहले कोई सेवा बुक नहीं की है',
    'रेफर किए गए मित्र की पहली बुकिंग पर ₹300 की छूट स्वचालित रूप से लागू की जाती है',
    'सफल बुकिंग पूर्णता के 24 घंटों के भीतर पुरस्कार जमा किए जाते हैं',
    'रेफरल पुरस्कारों के योग्य होने के लिए न्यूनतम ₹1,000 की बुकिंग मूल्य आवश्यक है',
    'विशेष मील के पत्थर बोनस: 5 रेफरल पर ₹2,000, 10 रेफरल पर ₹5,000, 25 रेफरल पर ₹15,000',
    'स्व-रेफरल और धोखाधड़ी गतिविधियों के परिणामस्वरूप खाता निलंबन होगा',
    'पुरस्कारों को बैंक ट्रांसफर, UPI या वॉलेट क्रेडिट के माध्यम से रिडीम किया जा सकता है',
    'जैन विधि विधान किसी भी समय शर्तों को संशोधित करने का अधिकार सुरक्षित रखता है',
    'कार्यक्रम सभी विधि सेवाओं के लिए मान्य है जिसमें पूजा, अभिषेक, शांति पाठ शामिल हैं',
  ]

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              नियम और शर्तें
            </h3>
            <p className="text-amber-100">कृपया हमारे कार्यक्रम दिशानिर्देशों को ध्यान से पढ़ें</p>
          </div>

          {/* Terms List */}
          <div className="p-8 md:p-12">
            <div className="space-y-4">
              {terms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 rounded-xl hover:bg-amber-50 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1">{term}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Quote */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-8 text-center border-t-2 border-amber-200">
            <div className="max-w-3xl mx-auto">
              <p className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'serif' }}>
                🙏 धर्मो रक्षति रक्षितः 🙏
              </p>
              <p className="text-gray-700 text-sm">
                धर्म उनकी रक्षा करता है जो इसकी रक्षा करते हैं
                <br />
                <span className="text-xs text-gray-600 italic">Dharma protects those who protect it</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ==================== MAIN PAGE COMPONENT ====================
export default function ReferAndEarnPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <HowItWorks />
      <CTASection />
      <TermsSection />
    </main>
  )
}