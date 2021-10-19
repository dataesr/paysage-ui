import { useContext, useEffect } from 'react';
import CreateForm from '../../components/CreateForm';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import NoSSRWrapper from '../../helpers/no-ssr-wrapper';
import CreateStructure from './form.json';

export default function Create({ data }) {
    const { stateForm: state, dispatchForm: dispatch } = useContext(AppContext);
    useEffect(() => {
        if (data && !state.departments.length) {
            dispatch({ type: 'UPDATE_DEPARTMENTS', payload: data });
        }
    });

    return (
        <Layout mainTitle="Create a structure">
            <NoSSRWrapper>
                <SideNavigation items={CreateStructure[0].form}>
                    <CreateForm jsonForm={CreateStructure[0]}/>
                </SideNavigation>
            </NoSSRWrapper>
        </Layout>
    );
}




