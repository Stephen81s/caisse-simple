/**
 * ============================================================
 *  getCraftsData()
 *  ------------------------------------------------------------
 *  Fournit toutes les recettes de craft alcool (purs + finis)
 *  Version PRO — synchronisée avec ox_inventory + serveur RP
 * ============================================================
 */
function getCraftsData() {

  return {

    /* ============================================================
       🧪 PRODUITS PURS (intermédiaires)
       ============================================================ */
    produits_purs: [

      {
        name: "Whisky pur",
        craft: "whiskypur",
        img: "https://i.postimg.cc/BZBVjrcH/wisky.png",
        ingredients: [
          ["Céréales humides", 1],
          ["Eau", 1]
        ]
      },

      {
        name: "Rhum pur",
        craft: "rhumpur",
        img: "https://i.postimg.cc/1Rrj8kcN/rhum.png",
        ingredients: [
          ["Mélasse", 1],
          ["Jus de canne à sucre", 4]
        ]
      },

      {
        name: "Vodka pure",
        craft: "vodkapur",
        img: "https://i.postimg.cc/KcDH16rL/vodka.png",
        ingredients: [
          ["Céréales humides", 4],
          ["Eau", 1],
          ["Levure", 1]
        ]
      },

      {
        name: "Gin pur",
        craft: "ginpur",
        img: "https://i.postimg.cc/59SRXhq2/gin.png",
        ingredients: [
          ["Céréales humides", 4],
          ["Eau", 1],
          ["Baies de genièvre", 2]
        ]
      },

      {
        name: "Blonche pure",
        craft: "blonchepur",
        img: "https://i.postimg.cc/7PnW5FMC/Stylized-GTA-V-style.png",
        ingredients: [
          ["Orge", 3],
          ["Eau", 1]
        ]
      },

      {
        name: "Blonde IPA pure",
        craft: "blondeipapur",
        img: "https://i.postimg.cc/bY9BZ7HS/IPA.png",
        ingredients: [
          ["Orge", 4],
          ["Eau", 1],
          ["Houblon", 2]
        ]
      },

      {
        name: "Printemps pur",
        craft: "printempspur",
        img: "https://i.postimg.cc/nVGPXyYj/printemps.png",
        ingredients: [
          ["Orge", 3],
          ["Eau", 1],
          ["Fruits de saison", 2]
        ]
      }
    ],


    /* ============================================================
       🍾 PRODUITS FINIS (mis en bouteille)
       ============================================================ */
    produits_finis: [

      {
        name: "Whisky",
        craft: "whisky",
        img: "https://i.postimg.cc/BZBVjrcH/wisky.png",
        ingredients: [
          ["Whisky pur", 1],
          ["Bouteille vide", 1]
        ]
      },

      {
        name: "Rhum",
        craft: "rhum",
        img: "https://i.postimg.cc/1Rrj8kcN/rhum.png",
        ingredients: [
          ["Rhum pur", 1],
          ["Bouteille vide", 1]
        ]
      },

      {
        name: "Vodka",
        craft: "vodka",
        img: "https://i.postimg.cc/KcDH16rL/vodka.png",
        ingredients: [
          ["Vodka pure", 1],
          ["Bouteille vide", 1]
        ]
      },

      {
        name: "Gin",
        craft: "gin",
        img: "https://i.postimg.cc/59SRXhq2/gin.png",
        ingredients: [
          ["Gin pur", 1],
          ["Bouteille vide", 1]
        ]
      },

      {
        name: "Blonche",
        craft: "blonche",
        img: "https://i.postimg.cc/7PnW5FMC/Stylized-GTA-V-style.png",
        ingredients: [
          ["Blonche pure", 1],
          ["Bouteille vide", 1]
        ]
      },

      {
        name: "Blonde IPA",
        craft: "blondeipa",
        img: "https://i.postimg.cc/bY9BZ7HS/IPA.png",
        ingredients: [
          ["Blonde IPA pure", 1],
          ["Bouteille vide", 1]
        ]
      },

      {
        name: "Printems",
        craft: "printems",
        img: "https://i.postimg.cc/nVGPXyYj/printemps.png",
        ingredients: [
          ["Printemps pur", 1],
          ["Bouteille vide", 1]
        ]
      }
    ]
  };
}