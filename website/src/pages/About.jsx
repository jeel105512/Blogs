import React from "react";

import styles from "./About.module.css";

const About = () => {
    return (
        <div className={styles["about-section"]}>
            <div className={styles["about-section-content"]}>
                <h2>About Jeel Blogs</h2>
                <p>This project serves as my endeavor to showcase my comprehension of JavaScript frameworks through the creation of a tiered architecture application. Following the project instructions provided, I am collaborating within a group of peers to ensure a comprehensive approach to the task at hand. The objective entails the development of both a presentation layer, represented by the front-end website, and a persistence layer, embodied by the API or CMS. Key requirements include the implementation of authentication and authorization mechanisms, the establishment of CRUD functionalities for one or more resources, and the creation of a CMS for user and resource management within the API. The front-end website, designed using React components, must integrate seamlessly with the API, utilizing a facade layer to manage data retrieval. A pivotal aspect of this project lies in its uniqueness; each group is encouraged to unleash their creativity and technical prowess to deliver an unparalleled solution. It is imperative to dedicate substantial effort to this project, as the grading criteria heavily weighs the level of commitment and innovation demonstrated. The top-performing projects will serve as benchmarks for evaluation, setting a high standard for excellence in execution.</p>
            </div>
        </div>
    );
};

export default About;
