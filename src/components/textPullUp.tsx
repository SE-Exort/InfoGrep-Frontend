"use client"
import { Box, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import * as React from 'react';
 
export function TextPullUp({
  text,
}: {
  text: string;
  className?: string;
}) {
  const splittedText = text.split(' ');
 
  const pullupVariant = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <Box display='flex' gap={1} justifyContent='center'>
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          ref={ref}
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? 'animate' : ''}
          custom={i}
        >
          <Typography variant='h4' fontWeight='bold' color="text.primary" >{current === '' ? <span>&nbsp;</span> : current}</Typography>
        </motion.div>
      ))}
    </Box>
  );
}

export default TextPullUp;