const inputElement = document.querySelector('.drop-zone-input');
const dropZone = inputElement.closest('.drop-zone');

dropZone.addEventListener('click', e => {
  inputElement.click();
});

inputElement.addEventListener('change', event => {
  updateThumbnail(dropZone, inputElement.files[0]);
});

dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('dragleave', dragLeave);
dropZone.addEventListener('drop', drop);

function dragOver(event) {
  event.preventDefault();
  console.log('drag over');
  this.className += ' outline';
}

function dragLeave(event) {
  event.preventDefault();
  this.className = 'drop-zone';
}

function drop(event) {
  event.preventDefault();

  if (event.dataTransfer.files.length) {
    inputElement.files = event.dataTransfer.files;
    updateThumbnail(dropZone, event.dataTransfer.files[0]);
  }

  this.className = 'drop-zone';
}

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector('.drop-zone-thumb');

  // First time - remove the prompt
  const initialPromptText = dropZoneElement.querySelector('.prompt-text');
  if (initialPromptText) {
    initialPromptText.remove();
  }

  // get the file extension - with the first letter capitalized
  let fileExtension = file.name.split('.').pop();
  fileExtension =
    fileExtension.charAt(0).toUpperCase() + fileExtension.slice(1);

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = createHtmlElementWithClassName('div', 'drop-zone-thumb');

    const overlayElement = createHtmlElementWithClassName('div', 'overlay');

    const overlayFileNameElement = createHtmlElementWithClassName(
      'p',
      'thumbnail-file-name',
    );
    overlayFileNameElement.textContent = file.name;

    const overlayPromptTextElement = createHtmlElementWithClassName(
      'p',
      'overlay-prompt-text',
    );
    overlayPromptTextElement.textContent = 'Drag and drop or click to replace';

    const removeFileButton = document.createElement('button');

    removeFileButton.addEventListener('click', e => {
      thumbnailElement.remove();
      dropZoneElement.appendChild(initialPromptText);
      e.stopPropagation();
    });

    const removeIcon = createHtmlElementWithClassName('i', 'fas fa-trash-alt');
    removeFileButton.append(removeIcon);
    removeFileButton.append(document.createTextNode('REMOVE'));

    overlayElement.appendChild(overlayFileNameElement);
    overlayElement.appendChild(document.createElement('hr'));
    overlayElement.appendChild(overlayPromptTextElement);
    overlayElement.appendChild(removeFileButton);

    thumbnailElement.appendChild(overlayElement);

    dropZoneElement.appendChild(thumbnailElement);
  } else {
    const overlayPromptTextElement = document.querySelector(
      '.thumbnail-file-name',
    );
    overlayPromptTextElement.textContent = file.name;
  }

  // Show thumbnail for image files
  if (file.type.startsWith('image/')) {
    if (document.querySelector('.thumbnail-doc-type')) {
      document.querySelector('.thumbnail-doc-type').remove();
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;

    // the file extension icon is not present
    if (!document.querySelector('.thumbnail-doc-type')) {
      const thumbnailDocType = document.createElement('div');

      const icon = document.createElement('i');
      icon.className = 'fas fa-file';

      const docExtensionText = document.createTextNode(fileExtension);
      const docExtension = document.createElement('span');
      docExtension.append(docExtensionText);

      docExtension.className = 'doc-extension';

      thumbnailDocType.appendChild(icon);
      thumbnailDocType.appendChild(docExtension);
      thumbnailDocType.classList.add('thumbnail-doc-type');

      thumbnailElement.appendChild(thumbnailDocType);
    } else {
      // the file extension icon is present we update the text
      document.querySelector('.doc-extension').textContent = fileExtension;
    }
  }
}

/**
 *
 * @param {String} elementName this the element that is created in the DOM
 * @param {String} className this is the class or classes that are added to the created element
 * @returns {HTMLElement} html element with the specified classes
 */
function createHtmlElementWithClassName(elementName, className) {
  const htmlElement = document.createElement(elementName);
  htmlElement.className = className;
  return htmlElement;
}
