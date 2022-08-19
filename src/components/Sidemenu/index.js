import { useEffect, useState } from 'react';
import { SideMenu as DsMenu, SideMenuLink } from '@dataesr/react-dsfr';

export default function Sidemenu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const items = document.querySelectorAll('[data-paysage-menu]');
    setMenuItems([...items]);
    console.log(items);
  }, []);

  const scroll = (id) => window.scroll({
    left: 0,
    top: document.getElementById(id).getBoundingClientRect().y,
    behavior: 'smooth',
  });

  return (
    <DsMenu buttonLabel="Navigation">
      {
        menuItems?.map(
          (item) => (
            <SideMenuLink
              id={item.getAttribute('id')}
              key={item.getAttribute('id')}
              href="/"
              onClick={() => scroll(item.getAttribute('id'))}
            >
              {item.getAttribute('data-paysage-menu')}
            </SideMenuLink>
          ),
        )
      }
    </DsMenu>
  );
}
