'use client';

import React from 'react';
import styles from './page.module.css';

import Chat from '../../components/chat';
import FileViewer from '../../components/file-viewer';

const TopCards = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          <FileViewer />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat />
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopCards;
