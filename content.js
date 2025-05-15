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
    // QUESTION - com que frequência essas classes mudam?
    const selV1 = "x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh";
    const selV2 = "x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1";
    
    const allElements = document.querySelectorAll('div[class]');
    
    const matched = Array.from(allElements).filter(el => {
      const cls = el.className.trim();
      return cls.startsWith(selV1) && cls.endsWith(selV2);
    });
    
    let elV1 = [...matched];
    const sideBarElements = [...getSidebarElements()];
    const duoCorrespondenceElements = [];
    
    // Percorre todo o array de elementos elV1 que contém mais correspondências para verificar quais elementos são os mesmos do array sideBarElements e adicionar os elementos iguais ao array duoCorrespondenceElements
    elV1.forEach(e1 => {
      const correspondence = sideBarElements.find(s => s === e1);
      if (correspondence) duoCorrespondenceElements.push(correspondence);
    })
    
    console.log(duoCorrespondenceElements)
    
    if (duoCorrespondenceElements) duoCorrespondenceElements.forEach(d => {
      d.remove();
    });
  }
  
  const observer = new MutationObserver(() => {
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
  
  observer.observe(document.body, {childList: true, subtree: true});
  
  setTimeout((() => {
    document.addEventListener("DOMContentLoaded", hideMappedElement);
    hideMappedElement();
  }), 100);
}

hideSuggestions();
