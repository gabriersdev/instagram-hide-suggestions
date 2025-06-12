function hideSuggestions() {
  console.log("Hide Suggestions loaded! " + new Date());
  
  const getSidebarElements = () => {
    const all = document.querySelectorAll('*');
    const matched = [];
    
    all.forEach((el) => {
      const style = getComputedStyle(el);
      const expectedWidth = style.getPropertyValue('--feed-sidebar-width');
      if (expectedWidth && style.width === expectedWidth.trim()) {
        matched.push(el);
      }
    });
    
    return matched;
  }
  
  const hideMappedElement = () => {
    const startsMatching = [
      "x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh",
      "x9f619 xjbqb8w x78zum5 x15mokao x1ga7v0g x16uus16 xbiv7yw"
    ];
    
    const endsMatching = [
      "x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1",
      "x1qjc9v5 x9f619 x78zum5 xdt5ytf xln7xf2 xk390pu x5yr21d x1n2onr6 x11njtxf xh8yej3"
    ];
    
    [...startsMatching, ...endsMatching].forEach(e => console.log("Matching: %s %s", startsMatching.includes(e) ? "class starts with" : "class ends with", e))
    
    const [selV1, selV2] = startsMatching;
    const [selV3, selV4] = endsMatching;
    
    const allElements = document.querySelectorAll('div[class]');
    
    const matched = Array.from(allElements).filter(el => {
      const cls = el.className.trim();
      return cls.startsWith(selV1) || cls.startsWith(selV2) || cls.endsWith(selV3) || cls.endsWith(selV4);
    });
    
    let elV1 = [...matched];
    const sideBarElements = [...getSidebarElements()];
    const duoCorrespondenceElements = [];
    
    // Percorre o array de elementos elV1 que contém mais correspondências para verificar quais elementos são os mesmos do array sideBarElements e adicionar os elementos iguais ao array duoCorrespondenceElements
    elV1.forEach(e1 => {
      const correspondence = sideBarElements.find(s => s === e1);
      if (correspondence) duoCorrespondenceElements.push(correspondence);
    })
    
    console.log(duoCorrespondenceElements)
    
    if (duoCorrespondenceElements) {
      duoCorrespondenceElements.forEach(d => {
        d.remove();
      });
      
      // Altera o texto para informar a remoção das sugestões - se houver elemento com esse conteúdo
      const textMatch = [
        {o: "Sugestões para você", s: "As Sugestões foram ocultadas"},
        {o: "Suggestions For You", s: "Suggestions has been hide"},
      ]
      
      Array.from(document.querySelectorAll('*')).map((el) => textMatch.map(i => i.o).includes(el.textContent) ? el : null).forEach(el => {
        if (el) el.textContent = textMatch.find(i => i.o === el.textContent)["s"];
      })
    }
  }
  
  const observer = new MutationObserver(() => {
    console.log("Observe dispatched! %s", new Date());
    
    // Acionando a função hideSuggestions
    hideSuggestions();
    
    // TODO - entender o código abaixo porquê aparentemente não faz o que deveria fazer - que é remover a barra lateral direita
    // Container da barra lateral direita
    const sidebar = document.querySelector('._ab8w');
    if (!sidebar) return;
    
    const suggestionBlocks = sidebar.querySelectorAll('._aacl');
    if (!suggestionBlocks) return;
    
    suggestionBlocks.forEach((block) => {
      const text = block.innerText || "";
      if (
        text.includes("Sugestões para você") ||
        text.includes("Suggestions For You")
      ) {
        const parent = block.closest('section') || block.closest('div');
        if (parent) parent.remove();
      }
    });
  });
  
  // BUG - observe parece não estar capturando todas as mudanças de página
  observer.observe(document.body, {childList: true, subtree: true});
  
  setTimeout((() => {
    document.addEventListener("DOMContentLoaded", hideMappedElement);
    hideMappedElement();
  }), 100);
}

hideSuggestions();
