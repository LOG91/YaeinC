export const printTargetNode = ({ targetSelector, nonDisplaySelector, nonDisplaySelectorAll }) => {
  const html = document.querySelector('html');
  nonDisplaySelectorAll.map(v => document.querySelectorAll(v).forEach(v => v.style.display = 'none'));
  nonDisplaySelector.forEach(v => document.querySelector(v).style.display = 'none');
  const printContents = document.querySelector(targetSelector).innerHTML;
  const printDiv = document.createElement("DIV");
  printDiv.className = "print-div";

  html.appendChild(printDiv);
  printDiv.innerHTML = printContents;
  document.body.style.display = 'none';
  window.print();
  window.location.href = window.location.href;
}