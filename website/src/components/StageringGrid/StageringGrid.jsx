import React, { useEffect, useState } from "react";
import styles from "./StageringGrid.module.css";
import anime from "animejs/lib/anime.es.js";

const StageringGrid = () => {
    const [toggled, setToggled] = useState(false);

    useEffect(() => {
        const createGrid = () => {
            const wrapper = document.querySelector(`#${styles["tiles"]}`);
            if (!wrapper) return; // Check if the wrapper element exists

            wrapper.innerHTML = "";
            const rows = Math.floor(document.body.clientHeight / 50);
            const columns = Math.floor(document.body.clientWidth / 50);
            wrapper.style.setProperty("--rows", rows);
            wrapper.style.setProperty("--columns", columns);
            createTiles(columns * rows, wrapper);
        };

        const createTiles = (quantity, wrapper) => {
            Array.from(Array(quantity)).map((_, index) => {
                wrapper.appendChild(createTile(index));
            });
        };

        const createTile = (index) => {
            const tile = document.createElement("div");
            tile.classList.add(styles["tile"]);
            tile.onclick = () => handleOnClick(index);
            return tile;
        };

        const handleOnClick = (index) => {
            setToggled(!toggled);
            const title = document.querySelector(`.${styles["home-header-title"]}`);
            if (title) {
                title.classList.toggle(styles["home-header-title-display-block"]);
            }

            anime({
                targets: `.${styles["tile"]}`,
                opacity: toggled ? 0 : 1,
                delay: anime.stagger(50, {
                    grid: [document.body.clientWidth / 50, document.body.clientHeight / 50],
                    from: index,
                }),
            });
        };

        createGrid();
        window.addEventListener("resize", createGrid);

        return () => {
            window.removeEventListener("resize", createGrid);
        };
    }, [toggled]);

    return (
        <div className={styles["home-header"]}>
            <h1 className={styles["home-header-title"]}><span>Jeel</span> Blogs</h1>
            <div id={styles["tiles"]}></div>
        </div>
    );
}

export default StageringGrid;