// Root.tsx

import React, { FunctionComponent, useState, useEffect } from "react";
import styles from "../styles/Root.module.css";

const Root: FunctionComponent = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 4); // 5 is the number of images
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.root}>
      <section className={styles.component1}>
        <div className={styles.image1Parent} style={{ transform: `translateX(-${currentImageIndex * 20}%)` }}>
          <img className={styles.image1Icon} alt="" src="/public/mockup3.png" style={{marginTop: -60}}/>
          <img className={styles.image2Icon} alt="" src="/public/60_1.png" style={{marginTop: -170}}/>
          <img className={styles.image3Icon} alt="" src="/public/image-3@2x.png" style={{marginTop: 0}}/>
          <img className={styles.image5Icon} alt="" src="/public/Group_24.png" />
        </div>
      </section>
    </div>
  );
};

export default Root;

