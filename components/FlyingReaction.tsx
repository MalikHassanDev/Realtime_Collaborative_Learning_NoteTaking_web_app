/* Facebook-style flying reactions with smoother animations */

/* Smooth upward motion with slight scaling */
@keyframes goUp0 {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    30% {
      transform: translateY(-10px) scale(1.1); /* Slight scale up */
      opacity: 1;
    }
    100% {
      transform: translateY(-150px) scale(0.9); /* Moves up and slightly shrinks */
      opacity: 0;
    }
  }
  
  @keyframes goUp1 {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    30% {
      transform: translateY(-10px) scale(1.05);
      opacity: 1;
    }
    100% {
      transform: translateY(-160px) scale(0.9);
      opacity: 0;
    }
  }
  
  @keyframes goUp2 {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    30% {
      transform: translateY(-20px) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translateY(-170px) scale(0.9);
      opacity: 0;
    }
  }
  
  /* Gentle horizontal bouncing effect */
  @keyframes leftRight0 {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-5px); /* Slight left-right motion */
    }
  }
  
  @keyframes leftRight1 {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(5px);
    }
  }
  
  @keyframes leftRight2 {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-7px);
    }
  }
  
  /* General class for smooth fading */
  .disappear {
    animation: disappear 2s ease-in-out forwards;
  }
  
  .goUp0 {
    animation: goUp0 2s ease-in-out forwards;
  }
  
  .goUp1 {
    animation: goUp1 2s ease-in-out forwards;
  }
  
  .goUp2 {
    animation: goUp2 2s ease-in-out forwards;
  }
  
  .leftRight0 {
    animation: leftRight0 2s ease-in-out infinite;
  }
  
  .leftRight1 {
    animation: leftRight1 2s ease-in-out infinite;
  }
  
  .leftRight2 {
    animation: leftRight2 2s ease-in-out infinite;
  }
  