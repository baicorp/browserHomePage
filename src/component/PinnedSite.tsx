import { forwardRef, useEffect, useRef, useState } from "react";
import ThreeDot from "../assets/svg/ThreeDot";
import { KeyPinnedSites } from "../utils/localSotrageKey";

export default function PinnedSite() {
  const [pinnedSiteData, setPinnedSiteData] = useState<PinnedSiteDatatype>([]);

  const [siteItemData, setSiteItemData] = useState<PinnedSiteDataObject>({
    siteId: "",
    siteTitle: "",
    siteLink: "",
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const pinnedSItes = localStorage.getItem(KeyPinnedSites);
    if (!pinnedSItes) return;
    const parsedPinnedSites = JSON.parse(pinnedSItes) as PinnedSiteDatatype;
    setPinnedSiteData(parsedPinnedSites);
  }, []);

  function toggleDialog() {
    if (!dialogRef.current) return;

    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();

    // clean dialogFormInput
    setSiteItemData({ siteId: "", siteTitle: "", siteLink: "" });
  }

  function editSiteItem(siteId: string, siteTitle: string, siteLink: string) {
    toggleDialog();
    setSiteItemData(() => ({ siteId, siteTitle, siteLink }));
  }

  return (
    <div className="relative grid grid-cols-5 grid-rows-2 gap-1.5 w-[320px]">
      {/* pinned site list */}
      {pinnedSiteData.map((siteData, index) => (
        <SiteItem
          key={index}
          siteId={siteData.siteId}
          siteLink={siteData.siteLink}
          siteTitle={siteData.siteTitle}
          editSiteItem={editSiteItem}
          setPinnedSiteData={setPinnedSiteData}
        />
      ))}

      {/* "add site" button when pinned site is <10 data */}
      {pinnedSiteData.length < 10 && (
        <AddSiteButton toggleDialog={toggleDialog} />
      )}

      {/* dialog */}
      <DialogPinnedSite
        pinnedSiteData={pinnedSiteData}
        siteItemData={siteItemData}
        setPinnedSiteData={setPinnedSiteData}
        setSiteItemData={setSiteItemData}
        toggleDialog={toggleDialog}
        ref={dialogRef}
      />
    </div>
  );
}

function SiteItem({
  siteId,
  siteLink,
  siteTitle,
  editSiteItem,
  setPinnedSiteData,
}: SiteItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function removePineedSite(siteId: string) {
    setPinnedSiteData((prev) => {
      const newPinnedSites = prev.filter(
        (siteData) => siteId !== siteData.siteId
      );
      localStorage.setItem(KeyPinnedSites, JSON.stringify(newPinnedSites));
      return newPinnedSites;
    });
    toggleMenu();
  }

  useEffect(() => {
    function closeOnClickOutside(e: MouseEvent) {
      // check if the mousedown happend inside the excluded area or not
      // if happened outside menu then fire the close menu
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnClickOutside);
    return () => {
      document.removeEventListener("mousedown", closeOnClickOutside);
    };
  }, []);

  return (
    <div className="relative group">
      <a
        href={validateSiteLink(siteLink)}
        target="_blank"
        className="flex flex-col gap-1 items-center"
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${siteLink}&sz=32`}
          alt={siteLink}
          className="card w-12 aspect-square p-3 rounded-xl"
        />
        <p className="text-xs line-clamp-1 text-ellipsis">{siteTitle}</p>
      </a>
      <div ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="cursor-pointer hidden group-hover:block absolute right-0 top-0 -translate-y-1/2 card shadow-themed-card rounded-lg p-1"
        >
          <ThreeDot />
        </button>
        {isMenuOpen && (
          <div className="overflow-hidden flex flex-col absolute z-10 card shadow-themed-card rounded-lg text-xs top-0 translate-y-1/6 left-full -translate-x-5">
            <div className="ml-auto">
              <button
                className="mt-1 mr-2 font-bold"
                title="close"
                onClick={toggleMenu}
              >
                x
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  toggleMenu();
                  editSiteItem(siteId, siteTitle, siteLink);
                }}
                className="w-full px-4 py-1.5 cursor-pointer hover:bg-themed-hover text-start"
              >
                edit
              </button>
              <button
                onClick={() => {
                  removePineedSite(siteId);
                }}
                className="-w-full px-4 py-1.5 cursor-pointer hover:bg-themed-hover text-start"
              >
                remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DialogPinnedSite = forwardRef<HTMLDialogElement, DialogPinnedSiteProps>(
  (
    {
      siteItemData,
      setSiteItemData,
      pinnedSiteData,
      setPinnedSiteData,
      toggleDialog,
    },
    dialogRef
  ) => {
    const formRef = useRef<HTMLFormElement>(null);

    function handleEditExistingSite() {
      const newPinnedSites = pinnedSiteData.map((site) => {
        if (site.siteId === siteItemData.siteId) {
          return {
            siteId: site.siteId,
            siteTitle: siteItemData.siteTitle,
            siteLink: siteItemData.siteLink,
          };
        }
        return {
          ...site,
        };
      });

      localStorage.setItem(KeyPinnedSites, JSON.stringify(newPinnedSites));
      setPinnedSiteData(newPinnedSites);
    }

    function handleAddNewSite(formData: FormData) {
      const title = formData.get("siteTitle") as string;
      const link = formData.get("siteLink") as string;
      const formValues: PinnedSiteDataObject = {
        siteId: new Date().toISOString(),
        siteTitle: title.trim(),
        siteLink: link.trim(),
      };

      setPinnedSiteData((prev) => {
        const newPinnedSites = [...prev, formValues];
        localStorage.setItem(KeyPinnedSites, JSON.stringify(newPinnedSites));
        return newPinnedSites;
      });
    }

    function handleOnChangeInput(
      field: keyof PinnedSiteDataObject,
      value: string
    ) {
      setSiteItemData((prev) => ({
        ...prev,
        [field]: value.trim(),
      }));
    }

    return (
      <dialog
        ref={dialogRef}
        className="backdrop:backdrop-blur-[2px] text-xs card absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
      >
        <div className="p-3 flex flex-col">
          <form
            className="flex flex-col gap-2"
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              // check if the title and link input is not empty
              // if empty then not add anything to pinnedSites data
              if (
                !formData.get("siteTitle")?.toString()?.trim() ||
                !formData.get("siteLink")?.toString()?.trim()
              ) {
                console.log("input field empty");
                return;
              }

              //check if this action is for edit existing pinnedSite using id
              if (siteItemData.siteId) {
                handleEditExistingSite();
              } else {
                handleAddNewSite(formData);
              }

              // close dialog
              toggleDialog();
            }}
          >
            <p className="text-themed-text font-medium">Save site</p>
            <div className="flex flex-col gap-0.5">
              <label htmlFor="siteTitle" className="text-themed-text-muted">
                site title
              </label>
              <input
                className="input flex-1 outline-0 rounded-md px-4 p-2 peer"
                type="text"
                name="siteTitle"
                id="siteTitle"
                value={siteItemData.siteTitle}
                onChange={(e) => {
                  handleOnChangeInput("siteTitle", e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label htmlFor="siteLink" className="text-themed-text-muted">
                site link
              </label>
              <input
                className="input flex-1 outline-0 rounded-md px-4 p-2 peer"
                type="text"
                name="siteLink"
                id="siteLink"
                value={siteItemData.siteLink}
                onChange={(e) => {
                  handleOnChangeInput("siteLink", e.target.value);
                }}
              />
            </div>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={toggleDialog}
                className="text-themed-text flex-1 px-10 p-1.5 border-2 border-themed-inverted-bg rounded-full"
              >
                close
              </button>
              <button
                type="submit"
                className="btn flex-1 px-10 p-1.5 rounded-full"
              >
                save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
);

function AddSiteButton({ toggleDialog }: { toggleDialog: () => void }) {
  return (
    <div
      onClick={toggleDialog}
      className="flex flex-col items-center gap-1 cursor-pointer"
    >
      <button className="btn hover:bg-themed-inverted-bg/85 cursor-pointer w-12 aspect-square p-3 rounded-full">
        <span>+</span>
      </button>
      <p className="text-xs">add site</p>
    </div>
  );
}

function validateSiteLink(link: string) {
  return link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `https://${link}`;
}

type PinnedSiteDatatype = PinnedSiteDataObject[];

type PinnedSiteDataObject = {
  siteId: string;
  siteLink: string;
  siteTitle: string;
};

type SiteItemProps = {
  siteId: string;
  siteLink: string;
  siteTitle: string;
  editSiteItem: (siteId: string, setTitle: string, setLink: string) => void;
  setPinnedSiteData: React.Dispatch<React.SetStateAction<PinnedSiteDatatype>>;
};

type DialogPinnedSiteProps = {
  siteItemData: PinnedSiteDataObject;
  setSiteItemData: React.Dispatch<React.SetStateAction<PinnedSiteDataObject>>;
  pinnedSiteData: PinnedSiteDatatype;
  setPinnedSiteData: React.Dispatch<React.SetStateAction<PinnedSiteDatatype>>;
  toggleDialog: () => void;
};
