class Search {
  static replaceHTMLEntity(str) {
    return str.replace(/[&<>"]/g, tag => Search.TAGS_TO_REPLACE[tag] || tag);
  }
  async fetchData() {
    if (!this.data) {
      this.data = await fetch(Search.DATA_URL).then(response => response.json());
    }
  }
  static searchText(keywords, text) {
    const matches = [];
    const wordSet = new Set();
    text = text.toLowerCase();
    for (const keyword of keywords) {
      const wordLen = keyword.length;
      if (wordLen === 0) {
        continue;
      }
      let position = 0;
      while ((position = text.indexOf(keyword, position)) > -1) {
        matches.push({ start: position, end: position + wordLen });
        wordSet.add(keyword);
        position += wordLen;
      }
    }
    matches.sort((left, right) => left.start - right.start || right.end - left.end);
    return { matches: matches, wordSet };
  }
  static highlightMatches(text, matches, ellipsis = true, charLimit = 140, offset = 20) {
    let i = 0, lastIndex = 0, charCount = 0;
    let result = '';
    while (i < matches.length) {
      const match = matches[i];
      if (ellipsis && match.start - offset > lastIndex) {
        result += `${Search.replaceHTMLEntity(text.substring(lastIndex, lastIndex + offset))} ... ${text.substring(match.start - offset, match.start)}`;
        charCount += offset * 2;
      }
      else {
        result += `${Search.replaceHTMLEntity(text.substring(lastIndex, match.start))}`;
        charCount += match.start - lastIndex;
      }
      let j = i + 1, end = match.end;
      while (j < matches.length && matches[j].start <= end) {
        end = Math.max(matches[j++].end, end);
      }
      result += `<mark>${Search.replaceHTMLEntity(text.substring(match.start, end))}</mark>`;
      charCount += end - match.start;
      i = j;
      lastIndex = end;
      if (ellipsis && charCount > charLimit) {
        break;
      }
    }
    if (lastIndex < text.length) {
      let end = text.length;
      if (ellipsis) {
        end = Math.min(end, lastIndex + offset);
      }
      result += `${Search.replaceHTMLEntity(text.substring(lastIndex, end))}`;
      if (ellipsis && end != text.length) {
        result += ' ...';
      }
    }
    return result;
  }
  static sortSearchResults(arr) {
    arr.sort((left, right) => right.keywordCount - left.keywordCount || right.hitCount - left.hitCount);
  }
  doSearch(searchInput) {
    searchInput = searchInput.toLowerCase();
    const keywords = [...new Set(searchInput.split(/[-\s]+/))];
    if (keywords.length === 1 && !keywords[0]) {
      return [];
    }
    const data = this.data;
    const results = [];
    for (const { title, summary, content, permalink, series } of data) {
      const { matches: titleMatches, wordSet: titleWordSet } = Search.searchText(keywords, title);
      const { matches: contentMatches, wordSet: contentWordSet } = Search.searchText(keywords, content);
      const hitCount = titleMatches.length * 10 + contentMatches.length;
      if (hitCount === 0) {
        continue;
      }
      const result = {
        title: titleMatches.length ? Search.highlightMatches(title, titleMatches, false) : title,
        excerpt: contentMatches.length ? Search.highlightMatches(content, contentMatches) : summary,
        url: permalink,
        hitCount: hitCount,
        keywordCount: new Set([...titleWordSet, ...contentWordSet]).size,
        series: series
      };
      results.push(result);
    }
    Search.sortSearchResults(results);
    return results;
  }
}
Search.DATA_URL = '/index.json';
Search.TAGS_TO_REPLACE = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '…': '&hellip;'
};
(function () {
  const engine = new Search();
  const searchBox = document.getElementById('search-box');
  const resultTitle = document.getElementById('result-title');
  const resultList = document.getElementById('result-list');
  function updateQueryString(input) {
    const pageURL = new URL(window.location.toString());
    if (input) {
      pageURL.searchParams.set('keyword', input);
    }
    else {
      pageURL.searchParams.delete('keyword');
    }
    window.history.replaceState('', '', pageURL.toString());
  }
  function handleQueryString() {
    const pageURL = new URL(window.location.toString());
    const keywords = pageURL.searchParams.get('keyword');
    searchBox.value = keywords || '';
    if (keywords) {
      makeSearch(keywords);
    }
    else {
      clear();
    }
  }
  function clear() {
    resultList.innerHTML = '';
    resultTitle.innerText = '';
  }
  function render(item) {
    const element = document.createElement('div');
    element.className = 'py-6';
    element.innerHTML = `<div class="flex flex-col-reverse lg:flex-row justify-between"><div class="w-full"><div class="prose"><a href="${item.url}" class="no-underline"><h3 class="mt-0">${item.title}</h3></a>${item.excerpt}</div></div></div>`;
    return element;
  }
  let lastSearch = '';
  function makeSearch(input) {
    if (!engine.data) {
      return;
    }
    input = input.trim();
    updateQueryString(input);
    if (lastSearch === input) {
      return;
    }
    lastSearch = input;
    if (input === '') {
      clear();
      return;
    }
    const startTime = performance.now();
    const results = engine.doSearch(input);
    clear();
    for (const result of results) {
      resultList.append(render(result));
    }
    const endTime = performance.now();
    resultTitle.innerText = `${results.length} Pages (${((endTime - startTime) / 1000).toFixed(3)} seconds)`;
  }
  window.addEventListener('load', function () {
    engine.fetchData().then(() => makeSearch(searchBox.value));
    searchBox.addEventListener('input', () => makeSearch(searchBox.value));
    handleQueryString();
    window.addEventListener('popstate', () => {
      handleQueryString();
    });
  });
})();
