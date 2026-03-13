'use client';

/**
 * Custom parser to convert HTML to Plate editor format while preserving all formatting
 * This is specifically designed to handle Word document conversions with proper formatting
 */
export function htmlToPlateFormat(html, editor) {
  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Process the HTML to ensure it's compatible with Plate editor
  const processedHtml = processHtmlForPlate(tempDiv);

  // Convert the processed HTML to Plate format
  const plateNodes = convertHtmlToPlateNodes(processedHtml, editor);

  // Add unique IDs to each node (required by Plate)
  return addIdsToNodes(plateNodes);
}

/**
 * Process HTML to ensure it's compatible with Plate editor
 */
function processHtmlForPlate(tempDiv) {
  // Process lists to ensure proper structure
  const lists = tempDiv.querySelectorAll('ul, ol');
  lists.forEach((list) => {
    // Ensure each list item has proper structure
    const listItems = list.querySelectorAll('li');
    listItems.forEach((item) => {
      // If a list item contains a list, ensure proper nesting
      const nestedLists = item.querySelectorAll('ul, ol');
      if (nestedLists.length > 0) {
        // Ensure the nested list is properly contained within the list item
        nestedLists.forEach((nestedList) => {
          if (nestedList.parentNode !== item) {
            item.appendChild(nestedList);
          }
        });
      }
    });
  });

  // Process paragraphs to ensure proper structure
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach((p) => {
    // Ensure paragraphs with only whitespace have a <br> tag
    if (p.textContent.trim() === '') {
      p.innerHTML = '<br />';
    }
  });

  // Process headings to ensure proper structure
  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    // Ensure headings with only whitespace have a <br> tag
    if (heading.textContent.trim() === '') {
      heading.innerHTML = '<br />';
    }
  });

  // Process bold and italic text to ensure proper structure
  const boldTexts = tempDiv.querySelectorAll('strong, b');
  boldTexts.forEach((bold) => {
    // Ensure bold text with only whitespace is removed
    if (bold.textContent.trim() === '') {
      bold.remove();
    }
  });

  const italicTexts = tempDiv.querySelectorAll('em, i');
  italicTexts.forEach((italic) => {
    // Ensure italic text with only whitespace is removed
    if (italic.textContent.trim() === '') {
      italic.remove();
    }
  });

  // Process tables to ensure proper structure
  const tables = tempDiv.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure table has proper structure
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      while (table.firstChild) {
        tbody.appendChild(table.firstChild);
      }
      table.appendChild(tbody);
    }
  });

  // Process blockquotes to ensure proper structure
  const blockquotes = tempDiv.querySelectorAll('blockquote');
  blockquotes.forEach((blockquote) => {
    // Ensure blockquotes with only whitespace have a <br> tag
    if (blockquote.textContent.trim() === '') {
      blockquote.innerHTML = '<br />';
    }
  });

  // Process horizontal rules
  const horizontalRules = tempDiv.querySelectorAll('hr');
  horizontalRules.forEach((hr) => {
    // Ensure horizontal rules are properly formatted
    hr.setAttribute('data-plate-type', 'hr');
  });

  return tempDiv;
}

/**
 * Convert processed HTML to Plate format nodes
 */
function convertHtmlToPlateNodes(element, editor) {
  // Create a new document fragment to hold the Plate nodes
  const plateNodes = [];

  // Process each child node
  Array.from(element.childNodes).forEach((node) => {
    const plateNode = convertNodeToPlate(node, editor);
    if (plateNode) {
      plateNodes.push(plateNode);
    }
  });

  return plateNodes;
}

/**
 * Convert a DOM node to a Plate node
 */
function convertNodeToPlate(node, editor) {
  // Handle text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text) {
      return { text };
    }
    return null;
  }

  // Handle element nodes
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node;
    const tagName = element.tagName.toLowerCase();

    // Get text formatting
    const formatting = getTextFormatting(element);

    // Process children
    const children = [];
    Array.from(element.childNodes).forEach((child) => {
      const childNode = convertNodeToPlate(child, editor);
      if (childNode) {
        children.push(childNode);
      }
    });

    // If no children and not a leaf node, add an empty text node
    if (children.length === 0 && !isLeafNode(tagName)) {
      children.push({ text: '' });
    }

    // Create the appropriate Plate node based on the tag
    switch (tagName) {
      case 'p':
        // Check if this is a list item disguised as a paragraph
        if (element.hasAttribute('data-plate-list-item')) {
          return {
            type: 'p',
            indent: 0,
            listStyleType: '',
            children: applyFormatting(children, formatting),
          };
        }
        return {
          type: 'p',
          children: applyFormatting(children, formatting),
        };

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return {
          type: tagName,
          children: applyFormatting(children, formatting),
        };

      case 'ul':
        // Convert unordered list to paragraphs with list styling
        return children.map((child) => ({
          type: 'p',
          indent: 0,
          listStyleType: '•',
          children: child.children || [{ text: '' }],
        }));

      case 'ol':
        // Convert ordered list to paragraphs with list styling
        return children.map((child, index) => ({
          type: 'p',
          indent: 0,
          listStyleType: `${index + 1}.`,
          children: child.children || [{ text: '' }],
        }));

      case 'li':
        return {
          type: 'p',
          indent: 0,
          listStyleType: '',
          children: applyFormatting(children, formatting),
        };

      case 'blockquote':
        return {
          type: 'blockquote',
          children: [
            {
              type: 'p',
              children: applyFormatting(children, formatting),
            },
          ],
        };

      case 'pre':
        return {
          type: 'code-block',
          children: [
            {
              type: 'code-line',
              children: applyFormatting(children, formatting),
            },
          ],
        };

      case 'code':
        return {
          type: 'code',
          children: applyFormatting(children, formatting),
        };

      case 'table':
        return {
          type: 'table',
          children: children,
        };

      case 'tbody':
        return {
          type: 'tbody',
          children: children,
        };

      case 'tr':
        return {
          type: 'tr',
          children: children,
        };

      case 'td':
        return {
          type: 'td',
          children: [
            {
              type: 'p',
              children: applyFormatting(children, formatting),
            },
          ],
        };

      case 'th':
        return {
          type: 'th',
          children: [
            {
              type: 'p',
              children: applyFormatting(children, formatting),
            },
          ],
        };

      case 'hr':
        return {
          type: 'hr',
          children: [{ text: '' }],
        };

      case 'strong':
      case 'b':
        return {
          text: element.textContent,
          bold: true,
        };

      case 'em':
      case 'i':
        return {
          text: element.textContent,
          italic: true,
        };

      case 'u':
        return {
          text: element.textContent,
          underline: true,
        };

      case 's':
      case 'strike':
        return {
          text: element.textContent,
          strikethrough: true,
        };

      case 'sub':
        return {
          text: element.textContent,
          subscript: true,
        };

      case 'sup':
        return {
          text: element.textContent,
          superscript: true,
        };

      case 'a':
        const href = element.getAttribute('href');
        return {
          type: 'a',
          url: href,
          target: element.getAttribute('target') || '_self',
          children: applyFormatting(children, formatting),
        };

      case 'img':
        const src = element.getAttribute('src');
        const alt = element.getAttribute('alt') || '';
        return {
          type: 'img',
          url: src,
          alt: alt,
          children: [{ text: '' }],
        };

      default:
        // For any other element, just process its children
        return {
          type: 'p',
          children: applyFormatting(children, formatting),
        };
    }
  }

  return null;
}

/**
 * Get text formatting from an element
 */
function getTextFormatting(element) {
  const formatting = {};

  // Check for bold
  if (
    element.querySelector('strong, b') ||
    element.style.fontWeight === 'bold' ||
    element.style.fontWeight >= 700
  ) {
    formatting.bold = true;
  }

  // Check for italic
  if (element.querySelector('em, i') || element.style.fontStyle === 'italic') {
    formatting.italic = true;
  }

  // Check for underline
  if (
    element.querySelector('u') ||
    element.style.textDecoration === 'underline'
  ) {
    formatting.underline = true;
  }

  // Check for strikethrough
  if (
    element.querySelector('s, strike') ||
    element.style.textDecoration === 'line-through'
  ) {
    formatting.strikethrough = true;
  }

  // Check for subscript
  if (element.querySelector('sub') || element.style.verticalAlign === 'sub') {
    formatting.subscript = true;
  }

  // Check for superscript
  if (element.querySelector('sup') || element.style.verticalAlign === 'super') {
    formatting.superscript = true;
  }

  return formatting;
}

/**
 * Apply formatting to children
 */
function applyFormatting(children, formatting) {
  if (Object.keys(formatting).length === 0) {
    return children;
  }

  return children.map((child) => {
    if (child.text !== undefined) {
      return { ...child, ...formatting };
    }

    if (child.children) {
      return {
        ...child,
        children: applyFormatting(child.children, formatting),
      };
    }

    return child;
  });
}

/**
 * Check if a node is a leaf node (doesn't need children)
 */
function isLeafNode(tagName) {
  return ['img', 'br'].includes(tagName);
}

/**
 * Add unique IDs to each node (required by Plate)
 */
function addIdsToNodes(nodes) {
  return nodes.map((node) => {
    const nodeWithId = { ...node, id: generateUniqueId() };

    if (nodeWithId.children) {
      nodeWithId.children = addIdsToNodes(nodeWithId.children);
    }

    return nodeWithId;
  });
}

/**
 * Generate a unique ID for a node
 */
function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36)
  );
}
