import Handlebars from 'handlebars'

const templates = {
  'feed-item': `
  <div>
    <p><img src="https://opengraph.githubassets.com/1/{{ repo_slug }}" alt="{{ repo_slug }}"/></p>
    
    <p>{{ description }}</p>
  
    <p>
      Language: {{ language }}<br>
      Star: {{ stargazers_count }}<br>
      Watch: {{ watchers_count }}
    </p>
  </div>
  `,
}
const templateCache: Record<string, HandlebarsTemplateDelegate> = {}

export async function render(template: string, data: any) {
  if (!templateCache[template]) {
    templateCache[template] = Handlebars.compile(templates[template])
  }

  return templateCache[template](data)
}
