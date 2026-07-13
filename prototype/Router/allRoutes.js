import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/index.html", "Accueil", "/pages/home.html"),
    new Route("/menus", "Nos Menus", "/pages/menus.html", "/js/menus-filter.js"),
    new Route("/signin", "Connexion", "/pages/signin.html", "/js/signin.js"),
    new Route("/signup", "Créer un compte", "/pages/signup.html", "/js/signup.js"),
    new Route("/commande", "Commander", "/pages/commande.html", "/js/commande.js"),
    new Route("/contact", "Nous contacter", "/pages/contact.html", "/js/contact.js"),
    new Route("/account", "Mon compte", "/pages/account.html", "/js/account.js"),
    new Route("/employe", "Espace Employé", "/pages/employe.html", "/js/employe.js"),
    new Route("/admin", "Espace Administrateur", "/pages/admin.html", "/js/admin.js"),
    new Route("/mentions-legales", "Mentions Légales", "/pages/mentions-legales.html"),
    ];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Vite & Gourmand";