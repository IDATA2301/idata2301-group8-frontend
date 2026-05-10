import { useRef, useState, type KeyboardEvent } from "react";
import styles from "./Tabs.module.css";

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

export const Tabs = ({
  items,
  defaultActiveId,
  ariaLabel = "Content Tabs",
  tabPanelClassName
}: TabsProps) => {
  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let newIndex = index;

    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % items.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + items.length) % items.length;
    } else {
      return;
    }

    const nextTab = items[newIndex];

    setActiveId(nextTab.id);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className={styles.tabList}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            aria-selected={activeId === item.id}
            aria-controls={`panel-${item.id}`}
            id={`tab-${item.id}`}
            tabIndex={activeId === item.id ? 0 : -1}
            onClick={() => setActiveId(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`${styles.tabButton} ${activeId === item.id ? styles.activeTab : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <div
            key={item.id}
            id={`panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            tabIndex={isActive ? 0 : -1}
            hidden={!isActive}
            className={tabPanelClassName}
          >
            {isActive && item.content}
          </div>
        );
      })}
    </div>
  );
};
