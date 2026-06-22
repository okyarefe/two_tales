import { Metadata } from 'next';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Contact Us | TwoTales AI',
  description: 'Get in touch with the TwoTales AI team',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-accent mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600">
          Have questions, feedback, or just want to say hello? Don&apos;t
          hesitate to contact me!
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        <div className="bg-white dark:bg-card rounded-lg shadow-md p-8 border border-border text-center relative overflow-hidden">
          {/* Mascot Image - positioned at top right inside */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 w-20 h-20 md:w-32 md:h-32 z-10 opacity-30">
            <Image
              src="/logo-mark.svg"
              alt="TwoTales Mascot"
              width={128}
              height={128}
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="flex justify-center mb-4 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 relative z-10">
            Email Me
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4 relative z-10">
            Reach out to me directly at:
          </p>
          <a
            href="mailto:support@twotalesai.com"
            className="text-accent hover:text-brick-700 font-medium text-xl inline-block mb-2 break-all relative z-10"
          >
            feokyar@gmail.com
          </a>
        </div>

        <div className="bg-accent/5 rounded-lg p-6 border border-accent/30">
          <h3 className="text-xl font-semibold mb-3 text-center">
            Response Time
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-center">
            I typically respond to all inquiries within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
