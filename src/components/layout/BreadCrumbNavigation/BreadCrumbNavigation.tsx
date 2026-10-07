import { Fragment } from "react";
import styles from "./BreadCrumbNavigation.module.css";

interface BreadCrumbItem {
  direction: string;
}

const BreadCrumbNavigation = ({ BreadCrumbItems }: { BreadCrumbItems: BreadCrumbItem[] }) => {
  return (
    <nav className={styles.breadcrumbsContainer}>
      <div className={styles.topLine} />
      <div className={styles.content}>
        {BreadCrumbItems.map((item, index) => {
          const isLast = index === BreadCrumbItems.length - 1;

          return (
            <Fragment key={index}>
              <span className={isLast ? styles.itemActive : styles.item}>
                {item.direction}
              </span>
              {!isLast && <span className={styles.separator}>/</span>}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default BreadCrumbNavigation;