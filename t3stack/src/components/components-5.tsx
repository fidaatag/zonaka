import { DynamicTabs } from "@/components/tabs-dyanmic"
import { Card } from "./ui/card"

const tabsData = [
  {
    value: "sd",
    label: "SD",
    title: "Nama Sekolah yang di select",
    description: "Update your account information.",
    fields: [
      { id: "name", label: "Name", defaultValue: "John Doe" },
      { id: "username", label: "Username", defaultValue: "@johndoe" },
    ],
    buttonText: "Save Changes",
  },
  {
    value: "smp",
    label: "SMP",
    title: "Change Password",
    description: "Set a new password for your account.",
    fields: [
      { id: "current-password", label: "Current Password", type: "password" },
      { id: "new-password", label: "New Password", type: "password" },
    ],
    buttonText: "Update Password",
  },
  {
    value: "sma",
    label: "SMA",
    title: "Profile Info",
    description: "Edit your public profile information.",
    fields: [
      { id: "bio", label: "Bio", defaultValue: "Developer & Creator" },
      { id: "location", label: "Location", defaultValue: "Indonesia" },
    ],
    buttonText: "Update Profile",
  },

]


export default function ExamplePage() {
  return (
    <>
      <Card className="p-5 w-full mx-auto mt-40">
        <h3 className="text-lg font-semibold">Data Akademik</h3>

        <DynamicTabs data={tabsData} />
      </Card>
    </>
  )
}
