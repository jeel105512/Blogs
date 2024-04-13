import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Index.module.css";

const Posts = ({ title }) => {
    axios.defaults.withCredentials = true;

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const postsResp = await axios.get("/api/posts/publicPosts");

            setPosts(postsResp.data);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            for (const card of document.querySelectorAll(`#${styles.cards} > div`)) {
                const rect = card.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }
        };

        const cardsContainer = document.getElementById(styles.cards);
        if (cardsContainer) {
            cardsContainer.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (cardsContainer) {
                cardsContainer.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, []);

    return (

        <div className={styles["blogs-show-section"]}>
            <h2 className={styles["blogs-show-section-title"]}>{title}</h2>
            <i className="fa-brands fa-jedi-order"></i>
            <div id={styles["cards"]}>
                {posts.map((post) => (
                    <div className={styles["card"]} key={post._id}>
                        <div className={styles["card-border"]}></div>
                        <div className={styles["card-content"]}>
                            <h2>Blog</h2>
                            <p>{post.title}</p>
                            <Link to={`/posts/${post._id}`} className={styles["card-content-button"]}>Read</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Posts;