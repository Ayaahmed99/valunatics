/**
 * About Valunetics Component
 * Company information, mission, vision, values, and contact details
 */
import { Mail, Phone, Building2, Target, Eye, Heart, ArrowRight } from 'lucide-react';

export default function AboutValunetics() {
  return (
    <div className="min-h-screen bg-brand-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-green to-brand-violetLight flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Valunetics</h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Full-Service Business Solutions & Professional Training
          </p>
        </div>

        {/* About Us Section */}
        <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-green to-brand-violetLight flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">About Valunetics</h2>
          </div>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              Valunetics is a full-service business solutions company providing marketing consulting, branding, UI/UX design, web development, and graphic design. We work with startups, SMEs, and growing brands to help them build a strong market presence, optimize their digital platforms, and communicate their value effectively.
            </p>
            <p>
              In addition to business services, Valunetics offers practical training programs designed to bridge the gap between theory and real-world application. Our training focuses on marketing, digital skills, design thinking, and business fundamentals, empowering individuals and teams to perform confidently in today's competitive market.
            </p>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-green to-brand-violetLight flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Our mission is to deliver integrated marketing, digital, and creative solutions that help businesses grow sustainably. We aim to support our clients not only through execution but also through knowledge transfer, ensuring long-term impact through hands-on training and strategic guidance.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-green to-brand-violetLight flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Our vision is to become a leading regional hub for business services and professional training, recognized for building impactful brands, high-performing digital experiences, and skilled professionals who drive innovation and growth.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-green to-brand-violetLight flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-white mb-1">Value Creation</h3>
                <p className="text-white/70 text-sm">Every solution is designed to create measurable business value.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-white mb-1">Quality & Excellence</h3>
                <p className="text-white/70 text-sm">High standards in strategy, design, and execution.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-white mb-1">Innovation</h3>
                <p className="text-white/70 text-sm">Continuous improvement and adoption of modern tools and trends.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-white mb-1">Partnership</h3>
                <p className="text-white/70 text-sm">Long-term collaboration, not one-time services.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 md:col-span-2">
              <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-white mb-1">Practical Learning</h3>
                <p className="text-white/70 text-sm">Training focused on real business needs and applications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-green to-brand-violetLight flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Contact Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Numbers */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-brand-green" />
                Phone
              </h3>
              <div className="space-y-3">
                <a 
                  href="tel:01011695530" 
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-brand-green/50 hover:bg-white/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30 transition-colors">
                    <Phone className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-white font-medium">01011695530</p>
                    <p className="text-white/60 text-sm">Primary</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 ml-auto group-hover:text-brand-green transition-colors" />
                </a>
                <a 
                  href="tel:01114007956" 
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-brand-green/50 hover:bg-white/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30 transition-colors">
                    <Phone className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-white font-medium">01114007956</p>
                    <p className="text-white/60 text-sm">Secondary</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 ml-auto group-hover:text-brand-green transition-colors" />
                </a>
              </div>
            </div>

            {/* Email Addresses */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-green" />
                Email
              </h3>
              <div className="space-y-3">
                <a 
                  href="mailto:Info@valunetics.com" 
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-brand-green/50 hover:bg-white/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30 transition-colors">
                    <Mail className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Info@valunetics.com</p>
                    <p className="text-white/60 text-sm">General Inquiries</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 ml-auto group-hover:text-brand-green transition-colors" />
                </a>
                <a 
                  href="mailto:Mariam.adel@valunetics.com" 
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-brand-green/50 hover:bg-white/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30 transition-colors">
                    <Mail className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Mariam.adel@valunetics.com</p>
                    <p className="text-white/60 text-sm">Contact Mariam Adel</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 ml-auto group-hover:text-brand-green transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services Summary */}
        <div className="bg-gradient-to-br from-brand-violetDark/50 to-brand-violetLight/30 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Marketing Consulting', 'Branding', 'UI/UX Design', 'Web Development', 'Graphic Design'].map((service, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 text-center hover:border-brand-green/50 transition-colors">
                <p className="text-white font-medium text-sm">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

