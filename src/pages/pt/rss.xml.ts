import { publishedArticles } from '../../data/articles';
import { articleFeed } from '../../lib/rss';
export function GET(){return articleFeed(publishedArticles,'pt');}
