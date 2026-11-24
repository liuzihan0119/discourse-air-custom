import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";

export default apiInitializer((api) => {
  const siteSettings = api.container.lookup("service:site-settings");
  if (
    api.getCurrentUser() ||
    !siteSettings.prevent_anons_from_downloading_files
  ) {
    return;
  }

  function promptForLogin(event) {
    if (event.button > 1 || !event.target.closest("a.attachment[href]")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    api.container.lookup("service:dialog").confirm({
      message: i18n("post.errors.attachment_download_requires_login"),
      confirmButtonLabel: "log_in",
      didConfirm: () =>
        api.container.lookup("route:application").send("showLogin"),
    });
  }

  api.decorateCookedElement(
    (element) => {
      element.addEventListener("click", promptForLogin);
      element.addEventListener("auxclick", promptForLogin);
    },
    { onlyStream: true }
  );
});
