import React, { useState, ChangeEvent } from "react";
import { Menu, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";

export enum MenuNames {
    Services = "services",
    Questions = "questions",
}

export interface Props {
    searchChanged: (newVal: string | null) => void;
}

const MainBar: React.FC<Props> = (props: Props) => {
    const [activeName, setActiveName] = useState<MenuNames | undefined>(undefined);
    return (
        <Menu>
            <Link to="/services">
                <Menu.Item
                    name={MenuNames.Services}
                    active={activeName === MenuNames.Services}
                    content={"Services"}
                    onClick={() => setActiveName(MenuNames.Services)}

                />
            </Link>
            <Link to="/questions">
                <Menu.Item
                    name={MenuNames.Questions}
                    active={activeName === MenuNames.Questions}
                    content={"Questions"}
                    onClick={() => setActiveName(MenuNames.Questions)}
                />
            </Link>
            <Menu.Menu
                position="right"
            >
                <Menu.Item>
                    <Input
                        icon='search'
                        placeholder='Filter Page...'
                        onChange={(event: ChangeEvent<HTMLInputElement>) => props.searchChanged(event.target.value)} />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
}

export default MainBar;