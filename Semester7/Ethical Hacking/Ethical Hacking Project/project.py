import subprocess
import re

def scan_wifi_windows():
    # Run Windows command to list nearby Wi-Fi networks
    result = subprocess.check_output(
        ["netsh", "wlan", "show", "networks", "mode=bssid"],
        shell=True
    ).decode(errors="ignore")

    networks = []
    blocks = result.split("SSID ")

    for block in blocks[1:]:
        # Extract SSID (Wi-Fi name)
        ssid_match = re.search(r": (.*)", block)
        ssid = ssid_match.group(1).strip() if ssid_match else "Unknown"

        # Extract encryption/authentication type
        security_match = re.search(r"Authentication\s*: (.*)", block)
        encryption = security_match.group(1).strip() if security_match else "Unknown"

        networks.append({
            "SSID": ssid,
            "Encryption": encryption
        })

    return networks


def print_report(networks):
    print("\n--- Wireless Security Report (Windows Version) ---\n")
    for net in networks:
        print(f"Network: {net['SSID']}")
        print(f"Encryption: {net['Encryption']}")

        if "WPA3" in net["Encryption"]:
            print("Excellent Security: WPA3 is the strongest available.")
        elif "WPA2" in net["Encryption"]:
            print("Good Security: WPA2 is secure if the password is strong.")
        elif "WPA" in net["Encryption"]:
            print("Medium Security: Old WPA is less secure than WPA2.")
        elif "WEP" in net["Encryption"]:
            print("Weak Security: WEP encryption can be cracked easily.")
        elif "Open" in net["Encryption"] or "None" in net["Encryption"]:
            print("High Risk: The network is not secured at all.")
        else:
            print("Security Status Unknown or Not Classified.")
        
        print("-----------------------------")


networks = scan_wifi_windows()
print_report(networks)