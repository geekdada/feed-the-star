{% extends "./component/layout.tpl" %}

{% block body %}
<div class="index-page">
  <h1>🌟 Feed the Star</h1>
  <form class="input-wrapper">
    <input type="text" required id="username" placeholder="Enter GitHub username here">
  </form>
  <small>
    <a href="/geekdada/rss" target="__blank">You can subscribe my star feed here!</a>
  </small>
</div>

<script src="/public/script.js"></script>
{% endblock %}
