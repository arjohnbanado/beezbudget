"use server";

import { revalidatePath } from "next/cache";

export async function retryFetchAccountsAction() {
  revalidatePath("/accounts");
}
