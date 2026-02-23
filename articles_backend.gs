function getAllArticles() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Articles");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idx = {};
  headers.forEach((h, i) => idx[h] = i);

  const list = [];

  for (let i = 1; i < data.length; i++) {

    if (!data[i][idx.Nom]) continue;

    list.push({
      Nom: data[i][idx.Nom] || "",
      PrixAchat: data[i][idx.PrixAchat] || 0,
      PrixVente: data[i][idx.PrixVente] || 0,
      Stock: data[i][idx.Stock] || 0,
      Categorie: data[i][idx.Categorie] || "",
      TypeCaisse: data[i][idx.TypeCaisse] || "",
      Types: data[i][idx.Types] || "",
      Entreprise: data[i][idx.Entreprise] || ""
    });
  }

  return list;
}
function updateArticle(article) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Articles");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idx = {};
  headers.forEach((h, i) => idx[h] = i);

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idx.Nom]).trim() === article.Nom.trim()) {

      sheet.getRange(i + 1, idx.PrixAchat + 1).setValue(article.PrixAchat);
      sheet.getRange(i + 1, idx.PrixVente + 1).setValue(article.PrixVente);
      sheet.getRange(i + 1, idx.Stock + 1).setValue(article.Stock);
      sheet.getRange(i + 1, idx.Categorie + 1).setValue(article.Categorie);
      sheet.getRange(i + 1, idx.TypeCaisse + 1).setValue(article.TypeCaisse);
      sheet.getRange(i + 1, idx.Types + 1).setValue(article.Types);
      sheet.getRange(i + 1, idx.Entreprise + 1).setValue(article.Entreprise);

      return { status: "OK", message: "✔ Article mis à jour" };
    }
  }

  return { status: "ERROR", message: "❌ Article introuvable" };
}
function deleteArticle(nom) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Articles");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idxNom = headers.indexOf("Nom");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idxNom]).trim() === nom.trim()) {
      sheet.deleteRow(i + 1);
      return { status: "OK", message: "🗑 Article supprimé" };
    }
  }

  return { status: "ERROR", message: "❌ Article introuvable" };
}