import { useState, useRef, type KeyboardEvent } from 'react';
import styles from './Tabs.module.css';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  ariaLabel?: string;
  tabPanelClassName?: string;
}

export const Tabs = ({ items, defaultActiveId, ariaLabel = "Content Tabs", tabPanelClassName }: TabsProps) => {
  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Handle Keyboard Navigation (Arrow keys)
  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + items.length) % items.length;
    } else {
      return; // Exit if not an arrow key
    }

    const nextTab = items[newIndex];
    setActiveId(nextTab.id);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div>
      {/* ARIA: tablist container */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={styles.tabList}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={el => { tabRefs.current[index] = el; }}
            role="tab"
            aria-selected={activeId === item.id}
            aria-controls={`panel-${item.id}`}
            id={`tab-${item.id}`}
            tabIndex={activeId === item.id ? 0 : -1} // Only active tab is in tab order
            onClick={() => setActiveId(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`${styles.tabButton} ${activeId === item.id ? styles.activeTab : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 4. ARIA: tabpanel for content */}
      {items.map((item) => (
        <div
          key={item.id}
          id={`panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${item.id}`}
          hidden={activeId !== item.id} // Hide inactive panels
          tabIndex={0} // Allows panel content to be reached by keyboard
          className={tabPanelClassName}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};
