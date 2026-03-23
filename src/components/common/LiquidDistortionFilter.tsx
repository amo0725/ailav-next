export default function LiquidDistortionFilter() {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0 }}
      aria-hidden="true"
    >
      <defs>
        <filter id="liquidDistort">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.018"
            numOctaves={3}
            result="turb"
            seed={2}
          >
            <animate
              attributeName="baseFrequency"
              values="0.012 0.018;0.016 0.024;0.012 0.018"
              dur="4s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          >
            <animate
              attributeName="scale"
              values="0;6;0"
              dur="1.5s"
              begin="indefinite"
              fill="freeze"
              id="liquidAnim"
            />
          </feDisplacementMap>
        </filter>
      </defs>
    </svg>
  );
}
