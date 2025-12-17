"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HiDownload, HiDocumentText } from 'react-icons/hi';
import Link from 'next/link';

const ResumeSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <HiDocumentText className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            My Resume
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto"
          >
            Download my resume to learn more about my experience, skills, and qualifications.
            I&apos;m always open to new opportunities and exciting projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/VisruthsarwinResume.pdf" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                <HiDownload className="w-5 h-5" />
                <span>Download Resume</span>
              </Button>
            </Link>

            <div className="text-sm text-muted-foreground">
              PDF • Updated December 2025
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeSection;