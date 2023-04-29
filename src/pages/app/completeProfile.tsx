import { type NextPageWithLayout } from '../_app';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import { Button } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';
import { DayPicker } from 'react-day-picker';

const CompleteProfile: NextPageWithLayout = () => {
  const [[slide, direction], setSlide] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setSlide([slide + newDirection, newDirection]);
  };

  return (
    <article className="flex h-screen justify-center px-6 py-10">
      <motion.form
        initial={{ opacity: 0, y: 75 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-fit rounded-xl border border-gray-300 bg-white p-10 shadow-2xl "
      >
        <h1 className="text-5xl font-medium">
          Let&apos;s finish setting up your account
        </h1>
        <AnimatePresence initial={false} custom={direction}>
          {slide === 0 && (
            <FormSlide title="What's your name, pal?" key="slide1">
              <Input
                type="text"
                placeholder="Enter your name"
                className="w-80"
              />
            </FormSlide>
          )}
          {slide === 1 && (
            <FormSlide title="How shall we refer to you?" key="slide2">
              <Input
                type="text"
                placeholder="E.g. he/him, they/them, she/her"
                className="w-80"
              />
            </FormSlide>
          )}
          {slide === 2 && (
            <FormSlide title="When were you born" key="slide3">
              <DatePicker />
            </FormSlide>
          )}
        </AnimatePresence>
        <div className="flex flex-col items-center">
          <button
            className={`absolute left-4 bottom-0 -translate-y-1/2 transform ${
              slide === 0 ? 'hidden' : 'cursor-pointer'
            }`}
            onClick={(e) => {
              e.preventDefault();
              paginate(-1);
            }}
          >
            <ArrowLeft size={48} />
          </button>
          <button
            className={`absolute right-4 bottom-0 -translate-y-1/2 transform ${
              slide === 2 ? 'hidden' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              paginate(1);
            }}
          >
            <ArrowRight size={48} />
          </button>
          <Button
            className={`absolute right-4 bottom-0 -translate-y-1/2 transform ${
              slide !== 2 ? 'hidden' : ''
            }`}
          >
            Let&apos;s go!
          </Button>
        </div>
      </motion.form>
    </article>
  );
};

const DatePicker = () => {
  const [date, setDate] = useState<Date>();

  return (
    <DayPicker
      captionLayout="dropdown-buttons"
      selected={date}
      onSelect={setDate}
      fromYear={1930}
      toYear={new Date().getFullYear()}
    />
  );
};

interface FormSlideProps {
  title: string;
  children: React.ReactNode;
}
const FormSlide: React.FC<FormSlideProps> = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="mt-10 flex flex-col"
    >
      <div className="space-y-4">
        <Label className="text-3xl font-medium">{title}</Label>
        {children}
      </div>
    </motion.div>
  );
};

export default CompleteProfile;
