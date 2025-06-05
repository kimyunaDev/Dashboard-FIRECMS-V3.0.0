import { useCallback, useMemo } from "react";

import {
    AppBar,
    AuthControllerContext,
    Authenticator,
    CircularProgressCenter,
    Drawer,
    FireCMS,
    ModeControllerProvider,
    NavigationRoutes,
    Scaffold,
    SideDialogs,
    SnackbarProvider,
    useBuildLocalConfigurationPersistence,
    useBuildModeController,
    useBuildNavigationController,
    useValidateAuthenticator
} from "@firecms/core";
import {
    FirebaseAuthController,
    FirebaseLoginView,
    FirebaseSignInProvider,
    FirebaseUserWrapper,
    useFirebaseAuthController,
    useFirebaseStorageSource,
    useFirestoreDelegate,
    useInitialiseFirebase,
} from "@firecms/firebase";
import { CenteredView, RemoveRoadIcon } from "@firecms/ui";
import { demoCollection } from "./collections/demo";



import { firebaseConfig } from "./firebase_config";
import { AnimeCollection } from "./collections/Anime";

function App() {

    // Use your own authentication logic here
    const myAuthenticator: Authenticator<FirebaseUserWrapper> = useCallback(async ({
        user,
    }) => {
        const allowedEmails = ["lalaxa7408@hedotu.com", "otrocorreo@gmail.com"];

        if(user) {
            const email = user.email  || "";
            const isAllowed = allowedEmails.includes(email);
            if (!isAllowed) {
                return false;
            }
        }
        return true;
    }, []);


    const collections = useMemo(() => [
        demoCollection,
        AnimeCollection
    ], []);

    const {
        firebaseApp,
        firebaseConfigLoading,
        configError
    } = useInitialiseFirebase({
        firebaseConfig
    });

    // Controller used to manage the dark or light color mode
    const modeController = useBuildModeController();

    const signInOptions: FirebaseSignInProvider[] = ["google.com", "password"];

    // Controller for managing authentication
    const authController: FirebaseAuthController = useFirebaseAuthController({
        firebaseApp,
        signInOptions
    });

    // Controller for saving some user preferences locally.
    const userConfigPersistence = useBuildLocalConfigurationPersistence();

    // Delegate used for fetching and saving data in Firestore
    const firestoreDelegate = useFirestoreDelegate({
        firebaseApp
    });

    // Controller used for saving and fetching files in storage
    const storageSource = useFirebaseStorageSource({
        firebaseApp
    });

    const {
        authLoading,
        canAccessMainView,
        notAllowedError
    } = useValidateAuthenticator({
        authController,
        authenticator: myAuthenticator,
        dataSourceDelegate: firestoreDelegate,
        storageSource
    });

    const navigationController = useBuildNavigationController({
        disabled: authLoading,
        collections,
        authController,
        dataSourceDelegate: firestoreDelegate
    });

    if (firebaseConfigLoading || !firebaseApp) {
        return <>
            <CircularProgressCenter/>
        </>;
    }

    if (configError) {
        return <CenteredView>{configError}</CenteredView>;
    }

    return (
        <SnackbarProvider>
            <ModeControllerProvider value={modeController}>
                <FireCMS
                    navigationController={navigationController}
                    authController={authController}
                    userConfigPersistence={userConfigPersistence}
                    dataSourceDelegate={firestoreDelegate}
                    storageSource={storageSource}
                >
                    {({
                          context,
                          loading
                      }) => {

                        if (loading || authLoading) {
                            return <CircularProgressCenter size={"large"}/>;
                        }

                        if (!canAccessMainView) {
                            return <FirebaseLoginView authController={authController}
                                                      firebaseApp={firebaseApp}
                                                      signInOptions={signInOptions}
                                                      notAllowedError={notAllowedError}/>;
                        }

                        return <Scaffold
                            autoOpenDrawer={false}>
                            <AppBar title={"Mi Tienda Online"}/>
                            <Drawer/>
                            <NavigationRoutes/>
                            <SideDialogs/>
                        </Scaffold>;
                    }}
                </FireCMS>
            </ModeControllerProvider>
        </SnackbarProvider>
    );

}

export default App;
