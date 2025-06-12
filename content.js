const hideSuggestions = () => {
  console.log("Hide Suggestions loaded! " + new Date());
  
  const textsToReplace = [{o: "Sugestões para você", s: "As Sugestões foram ocultadas"}, {o: "Suggestions For You", s: "Suggestions has been hide"},]
  
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
  
  const elementsIsInSuggestionBar = (elements) => {
    // Percorre o array de elementos que for passado em busca de um elemento irmão que tenha algum texto que corresponda ao que foi definido na propriedade "o" dos elementos do array textMatch
    return elements.filter((el) => Array.from(el.parentElement.querySelectorAll("*")).find(e => textsToReplace.map(i => i.o).includes(e.textContent)));
  }
  
  const hideMappedElement = () => {
    const startsMatching = ["x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh", "x9f619 xjbqb8w x78zum5 x15mokao x1ga7v0g x16uus16 xbiv7yw"];
    
    const endsMatching = ["x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1", "x1qjc9v5 x9f619 x78zum5 xdt5ytf xln7xf2 xk390pu x5yr21d x1n2onr6 x11njtxf xh8yej3"];
    
    const [selV1, selV2] = startsMatching;
    const [selV3, selV4] = endsMatching;
    
    const allElements = document.querySelectorAll('div[class]');
    
    const matched = Array.from(allElements).filter(el => {
      const cls = el.className.trim();
      return cls.startsWith(selV1) || cls.startsWith(selV2) || cls.endsWith(selV3) || cls.endsWith(selV4);
    });
    
    let elV1 = [...matched];
    const sideBarElements = [...getSidebarElements()];
    const suggestionBarElements = [...elementsIsInSuggestionBar(matched)];
    const correspondenceOk = [];
    
    // Percorre o array de elementos elV1 que contém mais correspondências para verificar quais elementos são os mesmos do array sideBarElements e adicionar os elementos iguais ao array duoCorrespondenceElements
    elV1.forEach(e1 => {
      let correspondence;
      if (window?.location.pathname === "/") correspondence = sideBarElements.find(s => s === e1);
      // Outra página, que não é a inicial, então verifica se elemento que deu match antes é apropriado para ser removido
      else correspondence = suggestionBarElements.find(s => s === e1);
      if (correspondence) correspondenceOk.push(correspondence);
    })
    
    console.log("Remove: ", correspondenceOk);
    
    if (correspondenceOk) {
      correspondenceOk.forEach(d => {
        // Oculta o elemento ao invés de remover do DOM
        d.dataset.IHS = "hidden";
        d.style.display = "none";
      });
      
      // Altera o texto para informar a remoção das sugestões - se houver elemento com esse conteúdo
      Array.from(document.querySelectorAll('*')).map((el) => textsToReplace.map(i => i.o).includes(el.textContent) ? el : null).forEach(el => {
        if (el) el.textContent = textsToReplace.find(i => i.o === el.textContent)["s"];
      })
    }
  }
  
  const observer = new MutationObserver(() => {
    console.log("Observe dispatched! %s", new Date());
    
    // Acionando a função hideMappedElements, para varrer novamente a página atrás de correspondências
    hideMappedElement();
    
    // Container da barra lateral direita
    const sidebar = document.querySelector('._ab8w');
    if (!sidebar) return;
    
    const suggestionBlocks = sidebar.querySelectorAll('._aacl');
    if (!suggestionBlocks) return;
    
    suggestionBlocks.forEach((block) => {
      const text = block.innerText || "";
      if (text.includes("Sugestões para você") || text.includes("Suggestions For You")) {
        const parent = block.closest('section') || block.closest('div');
        console.log(parent ? "Parent element to remove: " + parent : "");
        if (parent) {
          // Oculta o elemento ao invés de remover do DOM
          parent.dataset.IHS = "hidden";
          parent.style.display = "none";
        }
      }
    });
  });
  
  observer.observe(document?.body, {childList: true, subtree: true});
  
  setTimeout(hideMappedElement, 0);
}

hideSuggestions();
