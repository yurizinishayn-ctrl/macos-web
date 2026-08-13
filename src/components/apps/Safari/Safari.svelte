<script lang="ts">
  let url = "https://www.google.com";
  let inputUrl = "https://www.google.com";

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }
    url = target;
  }
</script>

<div class="safari-container">
  <div class="navbar">
    <form on:submit={handleSubmit} class="address-bar-form">
      <input
        type="text"
        bind:value={inputUrl}
        placeholder="Pesquisar ou digitar site"
        class="address-bar"
      />
    </form>
  </div>

  <div class="content">
    <iframe
      src={url}
      title="Safari Web View"
      sandbox="allow-scripts allow-same-origin allow-forms"
    ></iframe>
  </div>
</div>

<style>
  .safari-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .navbar {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #e6e6e6;
    border-bottom: 1px solid #d1d1d1;
  }

  .address-bar-form {
    width: 100%;
  }

  .address-bar {
    width: 100%;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #ffffff;
    font-size: 13px;
    outline: none;
    text-align: center;
  }

  .address-bar:focus {
    text-align: left;
    border-color: #007aff;
  }

  .content {
    flex: 1;
    width: 100%;
    height: 100%;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
