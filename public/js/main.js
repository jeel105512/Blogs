// for rich text editor using TinyMCE
tinymce.init({
  selector: '#content',
  plugins: 'a_tinymce_plugin',
  a_plugin_option: true,
  a_configuration_option: 400
});

//
let contetHtml = {
  keyFeatures: `
      <h2>Key Features...</h2>
      <div>
        <h5>1. Content Creation and Editing</h5>
        <p>CMS allows users to create, edit, and publish digital content seamlessly. The content creation
            process is often similar to using word processing software, making it accessible to users with
            varying technical backgrounds.</p>
      </div>
  
      <div>
        <h5>2. Content Organization</h5>
        <p>CMS provides a structured approach to organizing content. Users can categorize and tag content,
            making it easier to manage and navigate, especially on websites with a large volume of information.
        </p>
      </div>
  
      <div>
        <h5>3. Version Control</h5>
        <p>CMS often includes version control features, allowing users to track changes made to content over
            time. This is essential for collaboration and ensures that previous versions can be restored if
            needed.</p>
      </div>
  
      <div>
        <h5>4. User Permissions</h5>
        <p>To facilitate collaboration, CMS platforms offer role-based access control. Different users can have
            varying levels of access and permissions, ensuring that only authorized individuals can make
            specific changes.</p>
      </div>
  
      <div>
        <h5>5. Templates and Themes</h5>
        <p>Many CMS platforms support templates and themes, allowing users to customize the appearance of their
            websites without delving into complex coding. This is beneficial for individuals or organizations
            with limited web development skills.</p>
      </div>
  
      <div>
        <h5>6. Workflow Management</h5>
        <p>In larger organizations, CMS often includes workflow management features. This ensures that content
            goes through a defined review and approval process before being published, maintaining quality and
            consistency.</p>
      </div>
  
      <div>
        <h5>7. Plugins and Extensions</h5>
        <p>CMS platforms support plugins or extensions, additional pieces of software that extend functionality.
            This allows users to add features based on their specific needs, enhancing the capabilities of the
            CMS.</p>
      </div>
  
      <div>
        <h5>8. SEO-Friendly</h5>
        <p>Modern CMS platforms are designed to be search engine optimization (SEO) friendly. This helps in
            improving the visibility of content on search engines, ensuring that it reaches a wider audience.
        </p>
      </div>
      `,
  popularCMSPlatforms: `
      <h2>Popular CMS Platforms...</h2>
      <p><i>Several CMS platforms cater to different needs and preferences. Some of the popular ones include:</i></p>
      <p><b>WordPress:</b> Widely used for blogs and websites, known for its flexibility and extensive pluginecosystem.</p>
      <p><b>Joomla:</b> A versatile CMS suitable for various types of websites, offering a balance between ease of use and functionality.</p>
      <p><b>Drupal:</b> Ideal for more complex websites, providing advanced customization and scalability.</p>
    `,
  gettingStartedWithCMS: `
    <h2>Getting Started With CMS...</h2>
    <p><i>To get started with a CMS, follow these general steps:</i></p>
    <p><b>Choose a CMS Platform:</b> Select a CMS platform that aligns with your specific requirements and technical skill level.</p>
    <p><b>Install and Configure:</b> Install the CMS on your server and configure it according to your preferences.</p>
    <p><b>Content Creation:</b> Begin creating and adding content using the CMS interface.</p>
    <p><b>Customization:</b> Explore customization options such as themes, templates, and plugins to tailor the CMS to your needs.</p>
    <p><b>User Training:</b> Provide training to users who will be managing the content, ensuring they are comfortable with the CMS interface and functionalities.</p>
    `,
};

let navButtons = document.querySelectorAll(".content-container-nav button");
let content = document.querySelector(".content-container .content");

navButtons.forEach((button) => {
  button.addEventListener("click", (ele) => {
    content.innerHTML = contetHtml[ele.target.dataset.content];
    console.log(ele.target.dataset.content);
  });
});