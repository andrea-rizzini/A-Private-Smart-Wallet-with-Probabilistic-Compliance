import { deleteDir } from "../src/utils/deleteDir";
import { deleteUsers, deleteKeypairs, deleteKeypairsOnboarding, deleteChallenges, deleteContacts, deleteMaskedCommitments, deleteNullifiers } from "./database";

deleteUsers();
deleteKeypairs();
deleteKeypairsOnboarding();
deleteContacts();
deleteChallenges();
deleteMaskedCommitments();
deleteNullifiers();

deleteDir("app/data");