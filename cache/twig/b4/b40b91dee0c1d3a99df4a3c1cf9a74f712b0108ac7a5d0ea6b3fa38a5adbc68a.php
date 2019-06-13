<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* video.html.twig */
class __TwigTemplate_6c887bca20ee1a8f850c3f416b7d759edf84709e650194ad3de75dfebe9c108a extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'content' => [$this, 'block_content'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "partials/base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->parent = $this->loadTemplate("partials/base.html.twig", "video.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_content($context, array $blocks = [])
    {
        echo " 
<link rel=\"stylesheet\" type=\"text/css\" href=\"..\\assets\\css\\video.css\"></link>
<div id=\"swapLanguage\">
  <p>
    <a href=\"\" id=\"en\" >English</a>
  </p> 
  <p>|</p> 
  <p>
    <a href=\"\" id=\"es\" >Español</a>
  </p>
</div>
<center>
  <div class=\"wrapper\">
    <div id=\"videoOptions\" class=\"auto-grid\">
      <div id=\"videoOption\">
        <p>";
        // line 18
        echo $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "select", []), "videos", []);
        echo "</p>
        <div class=\"select\">
          <select id=\"videos\">
            ";
        // line 21
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["config"] ?? null), "video", []), "videos", []));
        foreach ($context['_seq'] as $context["_key"] => $context["video"]) {
            // line 22
            echo "              <option value=\"";
            echo $this->getAttribute($context["video"], "name", []);
            echo "\">";
            echo $this->getAttribute($context["video"], "name", []);
            echo "</option>
            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['video'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 24
        echo "          </select>
        </div>
      </div>

      <div>
        <p>";
        // line 29
        echo $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "select", []), "languages", []);
        echo "</p>
        <div class=\"select\">
          <select id=\"languages\">
            ";
        // line 32
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "languages", []));
        foreach ($context['_seq'] as $context["_key"] => $context["language"]) {
            // line 33
            echo "              <option value=\"";
            echo $this->getAttribute($context["language"], "code", []);
            echo "\">";
            echo $this->getAttribute($context["language"], "name", []);
            echo "</option>
            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['language'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 35
        echo "          </select>
        </div>
      </div>

      <div id=\"subtitleWrapper\">
        <p>";
        // line 40
        echo $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "select", []), "subtitles", []);
        echo "</p>
        <div class=\"select\">
          <select id=\"subtitles\">
            <option value=\"off\">";
        // line 43
        echo $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "select", []), "empty", []);
        echo "</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <h3 id=\"videoError\"></h3>
</center>
<div id=\"videosFrames\" class=\"resp-container\">
  <div id=\"loading\"></div>
</div>

<script>
  Window.Vinya = {defLang: '";
        // line 56
        echo $this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "defaultLang", []);
        echo "'};
  Object.assign(Window.Vinya, {'errorMsg': '";
        // line 57
        echo $this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "error", []);
        echo "'});
  ";
        // line 58
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["config"] ?? null), "video", []), "videos", []));
        foreach ($context['_seq'] as $context["_key"] => $context["video"]) {
            // line 59
            echo "    Object.assign(Window.Vinya, {'";
            echo $this->getAttribute($context["video"], "name", []);
            echo "': {} })
    ";
            // line 60
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute($context["video"], "ids", []));
            foreach ($context['_seq'] as $context["_key"] => $context["id"]) {
                // line 61
                echo "      Object.assign(Window.Vinya['";
                echo $this->getAttribute($context["video"], "name", []);
                echo "'], { ";
                echo $this->getAttribute($context["id"], "language", []);
                echo ": ";
                echo $this->getAttribute($context["id"], "id", []);
                echo "});
    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['id'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 63
            echo "  ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['video'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 64
        echo "  Window.Vinya.URLParams = {
    lang: \"lang\", 
    title: \"video\", 
    time: \"time\",
    sub: \"sub\"
  };

  // this function runs itself
  (function(){
    var lastParams = localStorage.getItem('params');
    // add the appropriate params to the website if they exist
    if (lastParams != undefined && !window.location.href.includes(lastParams)) {
      window.location.search = lastParams;
    }
    var tempURL = new URL(window.location.href);
    if (!tempURL.searchParams.has(Window.Vinya.URLParams.lang)) {
      tempURL.searchParams.append(Window.Vinya.URLParams.lang, Window.Vinya.defLang);
      // update the browser history
      if (history.pushState) {
        window.history.pushState({path:window.location.href},'',tempURL.href);
      }
    }
  })();
</script>
<script src=\"https://player.vimeo.com/api/player.js\" defer></script>
<script src=\"..\\assets\\js\\video.js\" defer></script>

";
    }

    public function getTemplateName()
    {
        return "video.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  176 => 64,  170 => 63,  157 => 61,  153 => 60,  148 => 59,  144 => 58,  140 => 57,  136 => 56,  120 => 43,  114 => 40,  107 => 35,  96 => 33,  92 => 32,  86 => 29,  79 => 24,  68 => 22,  64 => 21,  58 => 18,  39 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% extends 'partials/base.html.twig' %}

{% block content %} 
<link rel=\"stylesheet\" type=\"text/css\" href=\"..\\assets\\css\\video.css\"></link>
<div id=\"swapLanguage\">
  <p>
    <a href=\"\" id=\"en\" >English</a>
  </p> 
  <p>|</p> 
  <p>
    <a href=\"\" id=\"es\" >Español</a>
  </p>
</div>
<center>
  <div class=\"wrapper\">
    <div id=\"videoOptions\" class=\"auto-grid\">
      <div id=\"videoOption\">
        <p>{{ page.header.select.videos }}</p>
        <div class=\"select\">
          <select id=\"videos\">
            {% for video in config.video.videos %}
              <option value=\"{{ video.name }}\">{{ video.name }}</option>
            {% endfor %}
          </select>
        </div>
      </div>

      <div>
        <p>{{ page.header.select.languages }}</p>
        <div class=\"select\">
          <select id=\"languages\">
            {% for language in page.header.languages %}
              <option value=\"{{ language.code }}\">{{ language.name }}</option>
            {% endfor %}
          </select>
        </div>
      </div>

      <div id=\"subtitleWrapper\">
        <p>{{ page.header.select.subtitles }}</p>
        <div class=\"select\">
          <select id=\"subtitles\">
            <option value=\"off\">{{ page.header.select.empty }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <h3 id=\"videoError\"></h3>
</center>
<div id=\"videosFrames\" class=\"resp-container\">
  <div id=\"loading\"></div>
</div>

<script>
  Window.Vinya = {defLang: '{{page.header.defaultLang}}'};
  Object.assign(Window.Vinya, {'errorMsg': '{{ page.header.error }}'});
  {% for video in config.video.videos %}
    Object.assign(Window.Vinya, {'{{ video.name }}': {} })
    {% for id in video.ids %}
      Object.assign(Window.Vinya['{{ video.name }}'], { {{ id.language }}: {{ id.id }}});
    {% endfor %}
  {% endfor %}
  Window.Vinya.URLParams = {
    lang: \"lang\", 
    title: \"video\", 
    time: \"time\",
    sub: \"sub\"
  };

  // this function runs itself
  (function(){
    var lastParams = localStorage.getItem('params');
    // add the appropriate params to the website if they exist
    if (lastParams != undefined && !window.location.href.includes(lastParams)) {
      window.location.search = lastParams;
    }
    var tempURL = new URL(window.location.href);
    if (!tempURL.searchParams.has(Window.Vinya.URLParams.lang)) {
      tempURL.searchParams.append(Window.Vinya.URLParams.lang, Window.Vinya.defLang);
      // update the browser history
      if (history.pushState) {
        window.history.pushState({path:window.location.href},'',tempURL.href);
      }
    }
  })();
</script>
<script src=\"https://player.vimeo.com/api/player.js\" defer></script>
<script src=\"..\\assets\\js\\video.js\" defer></script>

{% endblock %}
", "video.html.twig", "C:\\wamp\\www\\grav\\user\\themes\\quark\\templates\\video.html.twig");
    }
}
