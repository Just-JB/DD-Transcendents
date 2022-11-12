import { FC } from 'react';
import Link from "next/link";
export const ContentContainer: FC = (props: any) => {

  return (
    <div className="flex-1 grid overflow-auto">
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="items-center">
        {props.children}
      </div>

      {/* SideBar / Drawer */}
      <div className="drawer-side absolute">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="p-4 overflow-y-auto bg-purple">
          <li>
            <Link href="/">
              <a className="btn btn-ghost btn-sm rounded-btn">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/mint">
              <a className="btn btn-ghost btn-sm rounded-btn">Mint</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
